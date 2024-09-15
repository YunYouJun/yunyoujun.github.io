// import 'valaxy'

// declare module 'valaxy' {
//   /**
//    * extend post
//    */
//   interface Post {
//     test: string
//   }
// }

declare interface window {
  __DEV__: boolean
  $pageData: any
}

declare module 'valaxy-addon-*'
