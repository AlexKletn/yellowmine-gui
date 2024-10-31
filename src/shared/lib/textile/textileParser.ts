import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Attachment } from '@entities/attachment/types';
import { RedmineApi } from '@shared/api/redmine-api';
import { AstNode } from '@shared/lib/textile/types';

const linkWithLabelRegex = /"([^"]+?)":((https?:\/\/)([0-9a-z./\-%_]+)+(:\d{0,10})?([\da-z;,/?:@&=+$-_.!~*'()#]+)(\?[\da-z;,/?:@&=+$-_.!~*'()#]+)?(#[\da-z;,/?:@&=+$-_.!~*'()#]+)?)/gi;
const linkRegex = /((https?:\/\/)([0-9a-z./\-%_]+)+(:\d{0,10})?([\da-z;,/?:@&=+$-_.!~*'()#]+)(\?[\da-z;,/?:@&=+$-_.!~*'()#]+)?(#[\da-z;,/?:@&=+$-_.!~*'()#]+)?)/gi;
const listLineRegex = /^([*|#]+?) (.+$)/i;
const imageRegex = /!(.+?\.(png|jpg|jpeg|gif|webp))!/gi;

const getListLineRegex = (level: string | number = '+?') => {
  return new RegExp(`^([*|#])${level} (.+$)`, 'i');
};

@Injectable({ providedIn: 'root' })
class Textile {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private redmineApi = inject(RedmineApi);

  async parse(input: string, attachments: Attachment[]) {
    const tree = this.analyze(input, attachments);

    return await this.generateTemplate(tree);
  }

  analyze(input: string | string[], attachments: Attachment[] = []) {
    const strings = typeof input === 'string' ? input.split(/\r\n/) : [...input];
    const tree: AstNode[] = [];

    let list = [];

    while (strings.length !== 0) {
      let line = strings.shift()!;

      if (/<\w+? .+\/>/.test(line)) {
        line = line
          .replace(/<\w+? .+\/>/g, match => (
            match
              .replace(/</, '&lt;')
              .replace(/>/, '&gt;')
              .replace(/\*/, '&ast;')
              .replace(/\+/, '&plus;')
              .replace(/-/, '&minus;')
              .replace(/_/, '&lowbar;')
          ));
      }

      if (getListLineRegex().test(line)) {
        list.push(line.replace(/^[*|#]/, '').trim());

        const nextLine = strings[0];

        if (
          (strings.length === 0 || !nextLine)
          || !listLineRegex.test(nextLine)
        ) {
          tree.push({
            type: 'list',
            variant: /^\*/.test(line) ? 'mark' : 'numeric',
            content: this.analyze([...list], attachments), // [...list],
          });
          list = [];
        }

        continue;
      }

      if (imageRegex.test(line)) {
        const fileName = line.replace(imageRegex, '$1');
        const attachment = attachments.find(a => a.filename === fileName);

        if (attachment) {
          tree.push({
            type: 'image',
            meta: attachment,
          });
        }

        continue;
      }

      if (linkWithLabelRegex.test(line)) {
        type Link = {
          label: string;
          link: string;
        };

        const links: {
          [key: `<[link${number}]>`]: Link;
        } = {};

        let index = 0;
        const match = line.replace(linkWithLabelRegex, (_, $1, $2) => {
          const linkKey: `<[link${number}]>` = `<[link${index++}]>`;

          links[linkKey] = {
            label: $1,
            link: $2,
          };

          return `<|>${linkKey}<|>`;
        });

        const group: AstNode['content'] = match
          .split('<|>')
          .map(
            (string) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              const link: Link | undefined = links[string];

              if (link) {
                return {
                  type: 'link',
                  meta: {
                    link: link.link,
                  },
                  content: this.analyze(link.label, attachments),
                };
              }

              return {
                type: 'text',
                content: this.analyze(string, attachments),
              };
            },
          );

        tree.push({
          type: 'group',
          content: group,
        });

        continue;
      }

      if (linkRegex.test(line)) {
        type Link = {
          link: string;
        };

        const links: {
          [key: `<[link${number}]>`]: Link;
        } = {};

        let index = 0;
        const match = line.replace(linkRegex, (_) => {
          const linkKey: `<[link${number}]>` = `<[link${index++}]>`;

          links[linkKey] = {
            link: _,
          };

          return `<|>${linkKey}<|>`;
        });

        const group: AstNode['content'] = match
          .split('<|>')
          .map(
            (string) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              const link: Link | undefined = links[string];

              if (link) {
                return {
                  type: 'link',
                  meta: {
                    link: link.link,
                  },
                };
              }

              return {
                type: 'text',
                content: this.analyze(string, attachments),
              };
            },
          );

        tree.push({
          type: 'group',
          content: group,
        });

        continue;
      }

      if (/<pre>/.test(line)) {
        const preCodeText = line.replace(/(.*?)<pre>.*?(<\/pre>)?/, '$1');

        if (preCodeText.length) {
          // tree.push({
          //   type: 'text',
          //   content: preCodeText,
          // });
        }

        const code = [];

        let lastLine = line;

        if (/<\/pre>/.test(line)) {
          code.push(line.replace(/<pre>(<code class="[\w\d-]+">)?(.+?)(<\/pre>)?/, '$2'));
        }
        else {
          const codeText = line.replace(/<pre>(<code class="[\w\d-]+">)?(.+?)?$/, '$2');
          if (codeText.length > 0) {
            code.push(codeText);
          }

          do {
            lastLine = strings.shift()!;

            if (lastLine)
              code.push(lastLine.replace(/(.*?)(<\/code>)?(<\/pre>)?/, '$1'));
          } while (!/(<\/code>)?<\/pre>/.test(strings[0]));
        }

        tree.push({
          type: 'code',
          content: code.map(codeLine => codeLine).join('\r\n'),
        });

        continue;
      }

      if (/^(<\/code>)?<\/pre>$/.test(line)) {
        continue;
      }

      if (line.length === 0) {
        tree.push({
          type: 'emptyLine',
        });

        continue;
      }

      if (/[_\-*+].+?[_\-*+]/.test(line)) {
        type TextSegment = {
          source: string;
          value: string;
          flags: {
            italic?: boolean;
            bold?: boolean;
            underline?: boolean;
            strikethrough?: boolean;
          };
        };
        const texts: {
          [key: `<[text${number}]>`]: TextSegment;
        } = {};

        let index = 0;
        line = line.replace(/([_\-*+]+?)([^_\-*+]+?)[_\-*+]+/g, (_, $1, $2) => {
          const textKey: `<[text${number}]>` = `<[text${index++}]>`;

          texts[textKey] = {
            source: _,
            value: $2,
            flags: {
              italic: /_/.test($1),
              bold: /^\*/.test($1),
              underline: /\+/.test($1),
              strikethrough: /-/.test($1),
            },
          };

          return `<|>${textKey}<|>`;
        });

        const group: AstNode['content'] = line
          .split('<|>')
          .map((string) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const textSegment: TextSegment | undefined = texts[string];

            if (textSegment) {
              return {
                type: 'text',
                meta: textSegment.flags,
                content: textSegment.value,
              };
            }

            return {
              type: 'text',
              content: string,
            };
          });

        tree.push({
          type: 'group',
          content: group,
        });

        continue;
      }

      tree.push({
        type: 'text',
        content: line,
      });
    }

    return tree;
  }

  async generateTemplate(tree: (AstNode | string)[]) {
    let output = '';
    const nodes = [...tree];

    while (nodes.length > 0) {
      const node = nodes.shift()!;

      if (typeof node === 'string') {
        output += node;
        continue;
      }

      const type = node.type;

      if (type === 'text') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const flags: {
          italic?: boolean;
          bold?: boolean;
          underline?: boolean;
          strikethrough?: boolean;
        } = node.meta;

        if (flags) {
          let text = '';

          if (flags.bold) {
            text += '<b>';
          }
          if (flags.italic) {
            text += '<i>';
          }
          if (flags.underline) {
            text += '<u>';
          }
          if (flags.strikethrough) {
            text += '<s>';
          }

          text += node.content;

          if (flags.strikethrough) {
            text += '</s>';
          }
          if (flags.underline) {
            text += '</u>';
          }
          if (flags.italic) {
            text += '</i>';
          }
          if (flags.bold) {
            text += '</b>';
          }

          output += text;
        }
        else {
          output += await this.generateTemplate(node.content as AstNode[]);
        }
      }

      if (type === 'list') {
        const listTag = node.variant === 'numeric' ? 'ol' : 'ul';

        if (!Array.isArray(node.content)) {
          continue;
        }

        const listItems = node.content;
        let listItemsCode = '';

        while (listItems.length > 0) {
          const item = listItems.shift()!;
          let itemString = '<li>';

          if (typeof item === 'string') {
            itemString += item;
          }
          else {
            itemString += await this.generateTemplate([item]);
          }

          if (typeof listItems[0] === 'object' && listItems[0].type === 'list') {
            itemString += await this.generateTemplate([listItems.shift()!]);
          }

          itemString += '</li>';

          listItemsCode += itemString;
        }

        output += `<${listTag}>${
          listItemsCode
        }</${listTag}>`;
      }

      if (type === 'group') {
        output += await this.generateTemplate(node.content as AstNode[]);
      }

      if (type === 'link') {
        const { meta } = node as AstNode<{
          link: string;
        }>;

        if (node.content) {
          output += `<a target="_blank" href="${meta!.link}">${
            await this.generateTemplate(node.content as AstNode[])
          }</a>`;
        }
        else {
          output += `<a target="_blank" href="${meta!.link}">${meta!.link}</a>`;
        }
      }

      if (type === 'image') {
        const { meta } = node as AstNode<Attachment>;
        const fileBuffer = await firstValueFrom(
          this.redmineApi.get(
            `/redmine/attachments/download/${meta!.id}/${meta!.filename}`,
            {
              responseType: 'arraybuffer',
            },
          ),
        );

        const file = new File([fileBuffer], meta!.filename);

        output += `<p-image class="image" preview src="${URL.createObjectURL(file)}"/>`;
      }

      if (output.length > 0 && type === 'emptyLine') {
        output += '<br />';
      }

      if (type === 'code') {
        const code = (node.content as string)
          .replace(/{/g, '&lbrace;')
          .replace(/}/g, '&rbrace;')
          .replace(/"/g, '&#34;');

        output += `<pre><code [highlightAuto]="'${
          code
        }'"></code></pre>`;
      }

      output += '\r\n';
    }

    return output.replace(/@/g, '&#64;');
  }
}

export default Textile;
