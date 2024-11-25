const { buildPagination, buildRecordRangeText, buildTitle } = require('../../../../app/models/builders/pagination')

describe('paginator test', () => {
  describe('buildPagination', () => {
    test('should handle a single page of results', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 15,
        results: [],
        page: 1
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toBe(undefined)
    })

    test('should handle a two pages of results on page one', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 25,
        results: [],
        page: 1
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: true,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=2'
        },
        previous: undefined
      })
    })

    test('should handle a two pages of results on page two', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 25,
        results: [],
        page: 2
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          }
        ],
        next: undefined,
        previous: {
          href: '/search?searchTerms=rex&page=1'
        }
      })
    })

    test('should handle a three pages of results on page one', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 55,
        results: [],
        page: 1
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: true,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=2'
        },
        previous: undefined
      })
    })

    test('should handle a three pages of results on page two', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 55,
        results: [],
        page: 2
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=3'
        },
        previous: {
          href: '/search?searchTerms=rex&page=1'
        }
      })
    })

    test('should handle a three pages of results on page three', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 55,
        results: [],
        page: 3
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          }
        ],
        next: undefined,
        previous: {
          href: '/search?searchTerms=rex&page=2'
        }
      })
    })

    test('should handle a four pages of results on page two', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 75,
        results: [],
        page: 2
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=4',
            number: 4
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=3'
        },
        previous: {
          href: '/search?searchTerms=rex&page=1'
        }
      })
    })

    test('should handle a four pages of results on page three', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 75,
        results: [],
        page: 3
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=4',
            number: 4
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=4'
        },
        previous: {
          href: '/search?searchTerms=rex&page=2'
        }
      })
    })

    test('should handle a five pages of results on page three', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 95,
        results: [],
        page: 3
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=4',
            number: 4
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=5',
            number: 5
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=4'
        },
        previous: {
          href: '/search?searchTerms=rex&page=2'
        }
      })
    })

    test('should handle a five pages of results on page four', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 95,
        results: [],
        page: 4
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=4',
            number: 4
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=5',
            number: 5
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=5'
        },
        previous: {
          href: '/search?searchTerms=rex&page=3'
        }
      })
    })

    test('should handle a six pages of results on page three', () => {
      const baseUrl = '/search?searchTerms=rex&page=1'
      const results = {
        totalFound: 115,
        results: [],
        page: 3
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=2',
            number: 2
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=4',
            number: 4
          },
          {
            ellipsis: true
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=6',
            number: 6
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=4'
        },
        previous: {
          href: '/search?searchTerms=rex&page=2'
        }
      })
    })

    test('should handle a six pages of results on page five', () => {
      const baseUrl = '/search?searchTerms=rex'
      const results = {
        totalFound: 115,
        results: [],
        page: 5
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            ellipsis: true
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=3',
            number: 3
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=4',
            number: 4
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=5',
            number: 5
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=6',
            number: 6
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=6'
        },
        previous: {
          href: '/search?searchTerms=rex&page=4'
        }
      })
    })

    test('should handle ten pages of results on page five', () => {
      const baseUrl = '/search?searchTerms=rex'
      const results = {
        totalFound: 195,
        results: [],
        page: 5
      }
      const res = buildPagination(results, baseUrl)
      expect(res).toEqual({
        items: [
          {
            current: false,
            href: '/search?searchTerms=rex&page=1',
            number: 1
          },
          {
            ellipsis: true
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=4',
            number: 4
          },
          {
            current: true,
            href: '/search?searchTerms=rex&page=5',
            number: 5
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=6',
            number: 6
          },
          {
            ellipsis: true
          },
          {
            current: false,
            href: '/search?searchTerms=rex&page=10',
            number: 10
          }
        ],
        next: {
          href: '/search?searchTerms=rex&page=6'
        },
        previous: {
          href: '/search?searchTerms=rex&page=4'
        }
      })
    })
  })

  describe('buildRecordRangeText', () => {
    test('should handle bad page number', () => {
      expect(buildRecordRangeText(undefined, 15)).toBe('1 to 15')
      expect(buildRecordRangeText('abc', 12)).toBe('1 to 12')
    })

    test('should handle being on page one', () => {
      expect(buildRecordRangeText(1, 25)).toBe('1 to 20')
    })

    test('should handle being on fifth page', () => {
      expect(buildRecordRangeText(5, 105)).toBe('81 to 100')
    })
  })

  describe('buildTitle', () => {
    test('should return blank string if not pagination - test 1', () => {
      const results = { totalFound: 10 }
      expect(buildTitle(results)).toBe('')
    })

    test('should return blank string if not pagination - test 2', () => {
      const results = { totalFound: 20 }
      expect(buildTitle(results)).toBe('')
    })

    test('should return page title if pagination and on page 1', () => {
      const results = { totalFound: 35, page: 1 }
      expect(buildTitle(results)).toBe('page 1 of 2')
    })

    test('should return page title if pagination and on page 2', () => {
      const results = { totalFound: 35, page: 2 }
      expect(buildTitle(results)).toBe('page 2 of 2')
    })
  })
})
