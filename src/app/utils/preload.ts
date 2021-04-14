export function preload(...args: string[]): Array<string> {
    const items = [];
    for (var i = 0; i < args.length; i++) {
        items[i] = args[i];
    }

    return items;
}