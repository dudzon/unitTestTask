const unitTestingTask  = require('./unitTestingTask');
const timezonedDate = require('timezoned-date');
global.Date = timezonedDate.makeConstructor(0);

describe('unitTestingTask function', () => {
  it('throws an error if format argument is not a string', () => {
    expect(() => unitTestingTask(123)).toThrow(TypeError);
  });

  it('throws an error if date argument is not a Date object, number or string', () => {
    expect(() => unitTestingTask('YYYY-MM-DD', {})).toThrow(TypeError);
  });

  it('returns a string', () => {
    expect(typeof unitTestingTask('YYYY-MM-DD')).toBe('string');
  });
});

describe('formatting date with different formats', () => {
  it.each([
    ['YYYY-MM-dd HH:mm:ss', '2022-01-01 12:34:56'],
    ['YYYY-MM-dd HH:mm:ss.ff', '2022-01-01 12:34:56.789'],
    ['YYYY-MM-dd hh:mm:ss A', '2022-01-01 12:34:56 PM'],
    ['YY-MMM-DDD h:m:s.f a', '22-Jan-Saturday 12:34:56.789 pm'],
    ['M-D H', '1-Sa 12'],
    ['YY-MM-d hh:m:s a', '22-01-1 12:34:56 pm'],
    ['YY-MMMM-DD hh:mm:s a', '22-January-Sat 12:34:56 pm']
  ])('format "%s" returns "%s"', (format, expected) => {
    const date = new Date(2022, 0, 1, 12, 34, 56, 789);
    expect(unitTestingTask(format, date)).toBe(expected);
  });
});

describe('lang function', () => {
  it('returns the current language if no arguments are passed', () => {
    expect(unitTestingTask.lang()).toBe('en');
  });

  it('sets the current language if a language string is passed', () => {
    unitTestingTask.lang('fr', {
      _months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      months: function (date) {
        return this._months[date.getMonth()];
      },
    });
    expect(unitTestingTask.lang('fr')).toBe('fr');
  });

  it('uses the correct language options when a language string is passed', () => {
    const options = {
      _months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      months: function (date) {
        return this._months[date.getMonth()];
      },
    };
    unitTestingTask.lang('fr', options);
  
    const date = new Date(2022, 0, 1); 
    const formattedDate = unitTestingTask('MMMM', date);
  
    expect(formattedDate).toBe('Janvier'); 
  });
});


describe('tokens object', () => {
  const date = new Date(2022, 0, 1, 2, 3, 4, 5); 

  beforeEach(() => {
    unitTestingTask.lang('en', {
      _months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      months: function (date) {
        return this._months[date.getMonth()];
      },
      _monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      monthsShort: function (date) {
        return this._monthsShort[date.getMonth()];
      },
      weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday'],
      weekdaysShort: ['Sun', 'Mon','Tue','Wed','Thu','Fri','Sat'],
      weekdaysMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
      meridiem : function (hours, isLower) {
          if (hours > 11) {
              return isLower ? 'pm' : 'PM';
          } else {
              return isLower ? 'am' : 'AM';
          }
      }
    });
  });

  it('returns the correct year in YYYY format', () => {
    expect(unitTestingTask('YYYY', date)).toBe('2022');
  });

  it('returns the correct year in YY format', () => {
    expect(unitTestingTask('YY', date)).toBe('22');
  });

  it('returns the correct month in MMMM format', () => {
    expect(unitTestingTask('MMMM', date)).toBe('January');
  });

  it('returns the correct month in MMM format', () => {
    expect(unitTestingTask('MMM', date)).toBe('Jan');
  });

  it('returns the correct month in MM format', () => {
    expect(unitTestingTask('MM', date)).toBe('01');
  });

  it('returns the correct month in M format', () => {
    expect(unitTestingTask('M', date)).toBe('1');
  });

  it('returns the correct weekday in DDD format', () => {
    expect(unitTestingTask('DDD', date)).toBe('Saturday');
  });

  it('returns the correct weekday in DD format', () => {
    expect(unitTestingTask('DD', date)).toBe('Sat');
  });

  it('returns the correct weekday in D format', () => {
    expect(unitTestingTask('D', date)).toBe('Sa');
  });

  it('returns the correct day in dd format', () => {
    expect(unitTestingTask('dd', date)).toBe('01');
  });

  it('returns the correct day in d format', () => {
    expect(unitTestingTask('d', date)).toBe('1');
  });

  it('returns the correct hour in HH format', () => {
    expect(unitTestingTask('HH', date)).toBe('02');
  });

  it('returns the correct hour in H format', () => {
    expect(unitTestingTask('H', date)).toBe('2');
  });

  it('returns the correct hour in hh format', () => {
    expect(unitTestingTask('hh', date)).toBe('02');
  });

  it('returns the correct hour in h format', () => {
    expect(unitTestingTask('h', date)).toBe('2');
  });

  it('returns the correct minute in mm format', () => {
    expect(unitTestingTask('mm', date)).toBe('03');
  });

  it('returns the correct minute in m format', () => {
    expect(unitTestingTask('m', date)).toBe('3');
  });

  it('returns the correct second in ss format', () => {
    expect(unitTestingTask('ss', date)).toBe('04');
  });

  it('returns the correct second in s format', () => {
    expect(unitTestingTask('s', date)).toBe('4');
  });

  it('returns the correct millisecond in ff format', () => {
    expect(unitTestingTask('ff', date)).toBe('005');
  });

  it('returns the correct millisecond in f format', () => {
    expect(unitTestingTask('f', date)).toBe('5');
  });

  describe('returns the correct meridiem in A format', () => {
    it.each([
      [['A', new Date(2022, 0, 1, 1)], 'AM'],
      [['A', new Date(2022, 0, 1, 23)], 'PM']
    ])('format "%A" returns "%A"', ([format, date], expected) => {
      expect(unitTestingTask(format, date)).toBe(expected);
    });
  });

  describe('returns the correct meridiem in a format', () => {
    it.each([
      [['a', new Date(2022, 0, 1, 1)], 'am'],
      [['a', new Date(2022, 0, 1, 23)], 'pm']
    ])('format "%a" returns "%a"', ([format, date], expected) => {
      expect(unitTestingTask(format, date)).toBe(expected);
    });
  });

  it('returns the correct timezone offset in ZZ format', () => {
    expect(unitTestingTask('ZZ', date)).toBe('+0000');
  });

  it('returns the correct timezone offset in Z format', () => {
    expect(unitTestingTask('Z', date)).toBe('+00:00');
  });
});

describe('register function', () => {
  it('registers a new formatter and returns a function', () => {
    const formatter = unitTestingTask.register('MY_FORMAT', 'YYYY-M-D');
    expect(typeof formatter).toBe('function');
  });

  it('adds the new formatter to the list of formatters', () => {
    unitTestingTask.register('MY_FORMAT', 'YYYY-M-D');
    expect(unitTestingTask.formatters()).toContain('MY_FORMAT');
  });

  it('returns the correct date format', () => {
    const date = new Date(2022, 0, 1); 
    const formatter = function (date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month}-${day}`;
    };
    unitTestingTask.register('MY_FORMAT', formatter);
    expect(formatter(date)).toBe('2022-1-1');
  });


  it('creates a formatter that formats dates correctly', () => {
    const formatter = unitTestingTask.register('MY_FORMAT', 'YYYY-M-D-d');
    const date = new Date(2022, 0, 1);
    expect(formatter(date)).toBe('2022-1-Sa-1');
  });

  it('creates a formatter that formats dates correctly in different languages', () => {
    const date = new Date(2022, 0, 2);
    const formatter = unitTestingTask.register('MY_FORMAT', {
      'en': 'MMMM d, YYYY',
      'fr': 'D d, MMMM YYYY',
    });
    const options = {
        _months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        months: function (date) {
          return this._months[date.getMonth()];
        },
        _monthsShort: ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"],
        monthsShort: function (date) {
          return this._monthsShort[date.getMonth()];
        },
        weekdays: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
        weekdaysShort: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
        weekdaysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
      };

    expect(formatter(date)).toBe('January 2, 2022');
    unitTestingTask.lang('fr', options);
    expect(formatter(date)).toBe('Di 2, Janvier 2022');
  });
});