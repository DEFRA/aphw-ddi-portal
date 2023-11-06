const { Readable } = require('stream')
const { uploadDataFile, downloadDataFile } = require('../../storage')
const xlsx = require('xlsx')

module.exports = [{
  method: 'GET',
  path: '/upload/data',
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      return h.view('upload/upload-data')
    }
  }
},
{
  method: 'POST',
  path: '/upload/data',
  options: {
    plugins: {
      crumb: false
    },
    payload: {
      maxBytes: (50 * 1024 * 1024) + 250,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        console.log(err)
        return h.view('upload/upload-data').takeover(400)
      }
    },
    handler: async (request, h) => {
      const filename = request.payload.data.hapi.filename
      const fileBuffer = request.payload.data._data
      const stream = new Readable()
      stream.push(fileBuffer)
      stream.push(null)
      await uploadDataFile(stream, filename)
      const buffer = await downloadDataFile(filename)
      const workbook = xlsx.read(buffer, { type: 'buffer' })
      const worksheet = workbook.Sheets['Example Spreadsheet']
      const data = xlsx.utils.sheet_to_json(worksheet, { blankrows: false, defval: null })
      console.log(data)
      return h.redirect('/upload/data')
    }
  }
}]
