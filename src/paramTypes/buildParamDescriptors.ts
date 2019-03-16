import { BaseParamType } from './BaseParamType'
import { ParamDescriptor } from './ParamDescriptor'
import { defaultFormatter } from './defaultFormatter'

type ParamDescriptors<TParamTypes extends { [k: string]: BaseParamType<any> }> = {
  [k in keyof TParamTypes]: ParamDescriptor<
    TParamTypes[k] extends BaseParamType<infer PT> ? ParamDescriptor<PT> : never
  >
}

export function buildParamDescriptors<T extends { [k: string]: BaseParamType<any> }>(
  paramTypes: T,
): ParamDescriptors<T> {
  const paramDescriptors = {} as ParamDescriptors<T>
  for (const k in paramTypes) {
    const built = paramTypes[k]['built']

    paramDescriptors[k] = {
      defaultValue: built.defaultValue,
      filter: value => built.filter({ matchedString: value, value }) as any,
      format: built.noEscape
        ? built.format || ((value: any) => value)
        : built.format
        ? value => defaultFormatter(built.format!(value))
        : defaultFormatter,
    }
  }
  return paramDescriptors
}
