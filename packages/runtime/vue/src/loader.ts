// FIXME: hack to check data-loader symbol，because vue router is no export
export function isDataLoader(loader: Record<string | symbol, unknown>) {
    const symbols = Object.getOwnPropertySymbols(loader)
    return symbols.length > 0
}