import qs from 'qs';
import moment from 'moment';
/**
 * 格式化日期
 * @param {string} value
 * @param {string} format
 */
export function formatDateTime(value, format){
    if (value && moment(value).isValid()) return moment(value).format(format);
    return null;
  };

  /**
   * qs.stringify去除空条件
   * @param {*} obj 
   * @param {*} collectionFormat 
   */
export function stringify(obj, collectionFormat = 'pipes') {
    if(obj === undefined || obj === null)
        return '';

    const newObj = Object.keys(obj).reduce((result, key) => {
        const value = obj[key];
        if(value === undefined || value === null || value === '')
            return result;
        if(Array.isArray(value)) {
            const items = value.filter(val => val !== undefined && val !== null && val !== '');
            if(items.length > 0)
                switch(collectionFormat) {
                    case 'csv':
                        result[key] = items.join(',');
                        break;
                    case 'ssv':
                        result[key] = items.join(' ');
                        break;
                    case 'tsv':
                        result[key] = items.join('\\');
                        break;
                    case 'multi':
                        result[key] = items;
                        break;
                    default:
                        result[key] = items.join('|');
                        break;
                }
        } else
            result[key] = value;

        return result
    }, {});

    return qs.stringify(newObj, {indices: false, skipNulls: true});
}
