// 定义Promise3种状态

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'


class MyPromise {
  constructor(execurte) {
    this.status = PENDING
    this.value = undefined
    this.resaon = undefined


    this.resolveCallBacks = []
    this.rejectCallBacks = []

    try {
      execurte(this.resolve, this.reject)
    } catch (err) {
      this.reject(err)
    }
  }

  resolve = (value) => {
    queueMicrotask(() => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.resolveCallBacks.forEach(fn => fn(this.value))
      }
    })
  }

  reject = (resaon) => {
    queueMicrotask(() => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.resaon = resaon
        this.rejectCallBacks.forEach(fn => fn(this.resaon))
      }
    })
  }

  then = (resolveCallBack, rejectCallBack) => {
    // 如果传入控制，则默认向后传入 值穿透
    resolveCallBack = resolveCallBack && typeof resolveCallBack === 'function' ? resolveCallBack : value => value

    rejectCallBack = rejectCallBack ? rejectCallBack : resaon => { throw resaon }

    let p = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          try {
            let callBackValue = resolveCallBack(this.value)
            this._returnValue(p, callBackValue, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }

      else if (this.status === REJECTED) {
        try {
          let callBackValue = rejectCallBack(this.resaon)
          this._returnValue(p, callBackValue, resolve, reject)
        } catch (err) {
          reject(err)
        }
      }
      else {
        this.resolveCallBacks.push(() => {
          queueMicrotask(() => {
            try {
              let callBackValue = resolveCallBack(this.value)
              this._returnValue(p, callBackValue, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })

        this.rejectCallBacks.push(() => {
          queueMicrotask(() => {
            try {
              let callBackValue = rejectCallBack(this.resaon)
              this._returnValue(p, callBackValue, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
      }

    })
    return p
  }

  _returnValue(p, callBackValue, resolve, reject) {
    if (p === callBackValue) {
      return reject(new TypeError('p === callBackValue'))
    }
    if (callBackValue instanceof MyPromise) {
      callBackValue.then(value => resolve(value), resaon => reject(reject))
    }
    else {
      resolve(callBackValue)
    }
  }
}


exports.MyPromise = MyPromise
