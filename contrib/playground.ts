import * as R from "rambdax"

(async () => {
  const a = [{ a: 1 }, { a: 2 }, { a: 3 }];

  const assertNumber = (x: any): number => {
    if (typeof x !== 'number') throw new Error("NaN")
    return x
  }
  const multiply = (a, b) => a * b
  const addOne = R.pipeAsync(assertNumber, async (x: number): Promise<number> => x + 1)
  const square = R.pipe(assertNumber, (x: number): number => x + x)

  const res = await R.pipedAsync(
    2,
    addOne,
    square,
  );
  console.log(res)
})()