import {
  ref,
  watch,
  SetupContext,
  computed,
  Prop,
} from 'vue'

// interface Transform<T, U> {
//   in: (val: T) => U
//   out: (val: U) => T
// }

type ValueProxyProps<P extends string, V> = {
  [K in P]: V;
}

export function valueProxyFactory <V, P extends string, T = any> (type: T, prop: P, event: string = prop) {
  const valueProxyProps = (defaults: Partial<ValueProxyProps<P, V>> = {}) => {
    return {
      [prop]: {
        type,
        default: defaults[prop],
      },
    } as { [K in P]: any }
  }

  const useValueProxy = (props: ValueProxyProps<P, V>, context: SetupContext) => {
    let internal: V

    const propIsDefined = computed(() => typeof props[prop] !== 'undefined')
    const listenerIsDefined = computed(() => typeof context.attrs[`onUpdate:${event}`] !== 'undefined')

    console.log(listenerIsDefined.value, propIsDefined.value)

    const comp = computed<V>({
      get () {
        if (propIsDefined.value) return props[prop]
        else return internal
      },
      set (v) {
        if (!propIsDefined.value) internal = v
        context.emit(`update:${event}`, v)
      },
    })

    // watch(() => props[prop], (val, oldVal) => {
    //   if (val === oldVal) return
    //   proxy.value = val
    // })

    // if (event) {
    //   watch(proxy, (val, oldVal) => {
    //     if (val === oldVal) return
    //     context.emit(event, val)
    //   })
    // }

    return { comp }
  }

  return { valueProxyProps, useValueProxy }
}

// const { useValueProxy } = valueProxyFactory('test', 'update:test')

// const props = {
//   test: false,
// }

// const { comp } = useValueProxy<boolean>(props, {})

// export function useValueProxy (
//   props:
// )

// export function useTransformedValueProxy<O, I = O> (
//   props: any,
//   context: SetupContext,
//   transform: Transform<O, I> | null = null,
//   prop: string = 'value',
//   event: string | null = 'input',
// ) {
//   const initial = typeof props[prop] !== 'undefined' ? transform ? transform.in(props[prop]) : props[prop] : null
//   const internal = ref(initial) as Ref<I> // TODO: currently have to force this

//   watch(() => props[prop], (val: O, oldVal: O) => {
//     if (typeof val === 'undefined' || val === oldVal) return
//     internal.value = transform ? transform.in(val) : val as any // TODO: anything we can do type wise here?
//   })

//   watch(internal, (val, oldVal) => {
//     if (deepEqual(val, oldVal) || !event) return
//     context.emit(event, transform ? transform.out(internal.value) : internal.value)
//   })

//   return internal
// }
