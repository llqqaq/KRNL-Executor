import request from '@/utils/request'
import qs from 'qs'

// 单文件上传
export const uploadSingle = file => {
  return request({
    url: '/upload_single',
    method: 'post',
    data: file
  })
}

// 单文件上传---hash
export const uploadHashSingle = file => {
  return request({
    url: '/upload_single',
    method: 'post',
    data: file
  })
}
// 单文件上传---进度条
export const uploadPecentSingle = (file, v) => {
  return request({
    url: '/upload_single',
    method: 'post',
    onUploadProgress: e => {
      const loaded = e.loaded
      const total = e.total
      v.percent && (v.percent = `${(loaded / total).toFixed(2) * 100}%`)
    },
    data: file
  })
}

// Base64文件上传
export const uploadBase64 = params => {
  return request({
    url: '/upload_single_base64',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(params)
  })
}

// 已经上传的切片
export const uploadAlready = params => {
  return request({
    url: '/upload_already',
    method: 'get',
    params
  })
}

// 切片上传
export const uploadChunk = file => {
  return request({
    url: '/upload_chunk',
    method: 'post',
    data: file
  })
}

// 合并切片
export const uploadMerge = params => {
  return request({
    url: '/upload_merge',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(params)
  })
}
