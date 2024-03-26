const rules = {
  'max-lines': ['warn', 500],
  'max-params': ['warn', 3],
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'no-underscore-dangle': [2, {
    allowAfterThis: true,
  }],
  '@stylistic/indent': ['error', 2, {
    VariableDeclarator: 'first',
    MemberExpression: 1,
    FunctionDeclaration: { body: 1, parameters: 1 },
  }],
  '@stylistic/comma-dangle': ['error', 'always-multiline'],
  '@stylistic/max-len': ['error', { code: 120 }],
  '@stylistic/function-paren-newline': ['error', { minItems: 3 }],

  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    {
      accessibility: 'explicit',
      overrides: {
        accessors: 'explicit',
        constructors: 'no-public',
        methods: 'explicit',
        properties: 'off',
        parameterProperties: 'explicit',
      },
    },
  ],
  '@typescript-eslint/member-ordering': [
    'error',
    {
      default: [
        'private-field',
        'public-field',
        'signature',
        'constructor',
        'public-method',
        'private-method',
      ],
    },
  ],
  'react/jsx-no-useless-fragment': 'off',
};

export default rules;
