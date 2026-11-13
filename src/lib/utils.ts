//checks value if its empty
export function isEmpty(value: unknown): boolean {
    if (value == null) return true

    if (typeof value === 'string') {
        return value.trim().length === 0
    }

    if (Array.isArray(value)) {
        return value.length === 0
    }

    if (value instanceof Set || value instanceof Map) {
        return value.size === 0
    }

    if (typeof value === 'object') {
        const prototype = Object.getPrototypeOf(value)

        // Only treat plain objects (including Object.create(null)) as objects
        // whose keys determine emptiness. Date, File, class instances, etc. are not empty.
        if (prototype === Object.prototype || prototype === null) {
            return Reflect.ownKeys(value).length === 0
        }
    }

    return false
}