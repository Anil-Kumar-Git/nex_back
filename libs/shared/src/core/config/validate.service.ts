import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidateService {
  static validateLanguageCodes(items: string[]) {
    if (items == null || items.length == 0) return;

    for (var i = 0; i < items.length; i++) {
      this.validateLanguageCode(items[i]);
    }
  }

  static validateLanguageCode(item: string) {
    switch (item) {
      case 'de':
      case 'en':
      case 'fr':
        break;
      default:
        throw new HttpException(
          item + ': languageCode not supported',
          HttpStatus.NOT_ACCEPTABLE,
        );
    }
  }
}
