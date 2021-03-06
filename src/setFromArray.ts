import { Ord } from 'fp-ts/lib/Ord'
import { every, fromArray, toArray } from 'fp-ts/lib/Set'
import * as t from 'io-ts'
import { either } from 'fp-ts/lib/Either'

export interface SetFromArrayC<C extends t.Mixed> extends t.Type<Set<t.TypeOf<C>>, Array<t.OutputOf<C>>, unknown> {}

export function setFromArray<C extends t.Mixed>(
  codec: C,
  O: Ord<t.TypeOf<C>>,
  name: string = `Set<${codec.name}>`
): SetFromArrayC<C> {
  const arr = t.array(codec)
  const toArrayO = toArray(O)
  const fromArrayO = fromArray(O)
  return new t.Type(
    name,
    (u): u is Set<t.TypeOf<C>> => u instanceof Set && every(codec.is)(u),
    (u, c) =>
      either.chain(arr.validate(u, c), as => {
        const set = fromArrayO(as)
        return set.size !== as.length ? t.failure(u, c) : t.success(set)
      }),
    set => arr.encode(toArrayO(set))
  )
}
