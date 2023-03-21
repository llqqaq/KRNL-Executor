import SparkMD5 from 'spark-md5'

/**
 * @description: 拿到文件的hash值
 * @Author: hfunteam
 * @param {*} file 文件，File类型
 * @return {
 *   buffer: 文件的二进制流
 *   hash: 生成的文件hash值
 *   suffix：文件后缀名
 *   filename: 文件名称 hash + suffix
 * }
 */
export const changeBuffer = (file) => {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = ev => {
      const buffer = ev.target.result
      const spark = new SparkMD5.ArrayBuffer()
      let hash = ''
      let suffix = ''
      spark.append(buffer)
      // 拿到文件的hash值
      // 同步过程，会堵塞
      hash = spark.end()
      // 匹配文件后缀名
      suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1]
      resolve({
        buffer,
        hash,
        suffix,
        filename: `${hash}.${suffix}`
      })
    }
  })
}
