import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import RedmineApiService from '../../../core/services/redmine-api/redmine-api.service';

@Injectable({ providedIn: 'root' })
class CustomFieldsService {
  constructor(private store: Store, private redmineApi: RedmineApiService) {
  }

  loadCustomFields() {
    // this.redmineApi.get('api/custom_fields.json').subscribe((out) => {
    //   console.log(out);
    //   // this.store.dispatch(new SetCustomFields(this.redmineApi.getCustomFields()));
    // });
  }
}

export default CustomFieldsService;
