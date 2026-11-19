
onRecordBeforeCreateRequest((e) => {
  const authRecord = e.auth

  if (!authRecord || authRecord.collection().name !== 'users') {
    throw new BadRequestError('Only logged-in users can create a concessioner record.')
  }

  e.record.set('verified', true)

  e.next()
}, 'concessioner')
