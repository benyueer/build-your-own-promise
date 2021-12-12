// import MyPromise from '../promise'
const {MyPromise} = require('../promise')

// console.log(MyPromise)

let p = new MyPromise((resolve, reject) => {
  resolve(10)
})


p.then(res => {
  console.log(1, res)
  return new MyPromise(resolve => {
    setTimeout(() => {
      resolve(123)
    }, 1000)
  })
}).then(res => {
  console.log(2, res)
  return res
}).then(new MyPromise(resolve => {
  resolve(1212)
})).then(1).then(2)
  .then(res => {
  console.log(3, res)
  }, err => {
    console.log(err)
})