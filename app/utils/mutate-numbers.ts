export const change = (i: number) => (input: number) => i + input;

export const increment = change(1);

export const decrement = change(-1);
