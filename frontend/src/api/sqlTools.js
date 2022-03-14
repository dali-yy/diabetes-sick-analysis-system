export function getList() {
    return fetch('http://127.0.0.1:3000/sql/getList', {
          method: 'post',
        }).then(res => { return res.json() })
}

export function getExam(data) {
    return fetch('http://127.0.0.1:3000/sql/getExam', {
          method: 'post',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        }).then(res => { return res.json() })
}

export function deleteHis(data) {
    return fetch('http://127.0.0.1:3000/sql/deleteHis', {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => { return res.json() })
}

export function rmGetList() {
  return fetch('http://127.0.0.1:3000/sql/rmGetList', {
        method: 'post',
      }).then(res => { return res.json() })
}

export function rmDelete(data) {
  return fetch('http://127.0.0.1:3000/sql/rmDelete', {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => { return res.json() })
}

export function sickFileToSql(data) {
  return fetch('http://127.0.0.1:3000/sql/sickFileToSql', {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => { return res.text()})
}

export function rmFileToSql(data) {
  return fetch('http://127.0.0.1:3000/sql/rmFileToSql', {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => { return res})
}
