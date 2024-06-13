import ApiService from './framework/api-service';

const destinationsUrl = 'destinations';

export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({url: destinationsUrl})
      .then(ApiService.parseResponse);
  }
}
