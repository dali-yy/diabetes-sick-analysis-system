export function saveExam(formData) {
    return fetch('http://127.0.0.1:3000/process/saveExam', {
          method: 'post',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        }).then(res => { return res.text() })
}

export function analysis(formData) {
    return fetch('http://127.0.0.1:3000/process/analysis', {
          method: 'post',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        }).then(res => { return res.text() })
}

export function analysisFile(formData) {
  return fetch('http://127.0.0.1:3000/process/analysisFile', {
        method: 'post',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => { return res.text()})
}

export function rmAnalysis(formData) {
  return fetch('http://127.0.0.1:3000/process/rmFilePredict', {
        method: 'post',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => { return res.text() })
}

export function rmSave(formData) {
  return fetch('http://127.0.0.1:3000/process/rmSave', {
        method: 'post',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => { return res.text() })
}

export function rmAnalysisOne(formData) {
  return fetch('http://127.0.0.1:3000/process/rmOnePredict', {
        method: 'post',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => { return res.text() })
}

export function anomalyDetection(formData) {
  return fetch('http://127.0.0.1:3000/process/anomalyDetection', {
    method: 'post',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => { return res.text() })
}
