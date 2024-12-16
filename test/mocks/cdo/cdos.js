/**
 * @param total
 * @param within30
 * @param nonComplianceLetterNotSent
 * @return {{preExempt: {total: number, within30: number}, failed: {nonComplianceLetterNotSent: number}}}
 */
const buildCdoCounts = ({
  total,
  within30,
  nonComplianceLetterNotSent
}) => ({
  preExempt: {
    total: total ?? 0,
    within30: within30 ?? 0
  },
  failed: {
    nonComplianceLetterNotSent: nonComplianceLetterNotSent ?? 0
  }
})

const buildSummaryCdosApiResponse = cdosPartial => {
  const count = cdosPartial?.cdos?.length ?? 0

  return {
    cdos: [],
    count,
    counts: {
      preExempt: {
        total: 0,
        within30: 0
      },
      failed: {
        nonComplianceLetterNotSent: 0
      }
    },
    ...cdosPartial
  }
}

const buildSummaryCdoResponse = partialResponse => {
  return {
    cdos: [],
    counts: {
      preExempt: {
        total: 0,
        within30: 0
      },
      failed: {
        nonComplianceLetterNotSent: 0
      }
    },
    ...partialResponse
  }
}

module.exports = {
  buildCdoCounts,
  buildSummaryCdosApiResponse,
  buildSummaryCdoResponse
}
