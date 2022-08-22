export default function If({ condition, children }) {
    if (!condition) {
        return null;
    }

    return children;
}
