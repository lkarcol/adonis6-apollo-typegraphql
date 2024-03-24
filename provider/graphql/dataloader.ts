import { createParamDecorator } from 'type-graphql'
import DataLoader from 'dataloader'
import { HttpContext } from '@adonisjs/core/http'

type BatchFn<T, K> = DataLoader.BatchLoadFn<T, K>
export type DataloaderType = <T, K>(batchFn: BatchFn<T, K>) => any

export class DataloderService {
  private dataLoader: any | null = null

  getDataloder<T, K>(batchFn: BatchFn<T, K>) {
    if (this.dataLoader) {
      return this.dataLoader
    }
    this.dataLoader = new DataLoader(batchFn)
    return this.dataLoader
  }
}

export default function GetDataloader(name: string) {
  return createParamDecorator<HttpContext>(({ args, context }): DataloderService => {
    const { dataloader } = context

    if (dataloader && dataloader[name]) {
      return dataloader[name]
    }

    context.dataloader = {
      ...context.dataloader,
      [name]: new DataloderService(),
    }

    return context.dataloader[name]
  })
}
