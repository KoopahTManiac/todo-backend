const getEnvVariable = (variable: string): string => {
    const value = process.env[variable];

    if (!value) {
        throw new Error(`${variable} is not set`);
    }

    return value;
};

export const validateEnvString = (variable: string): string => {
    return getEnvVariable(variable);
};

export const validateEnvNumber = (variable: string): number => {
    const value = getEnvVariable(variable);
    const number = Number(value);

    if (Number.isNaN(number)) {
        throw new Error(`${variable} is not a valid number`);
    }

    return number;
};

export const EnvString = (variable: string, defaultValue: string): string => {
    return process.env[variable] ?? defaultValue;
};

export const EnvNumber = (variable: string, defaultValue: number): number => {
    const value = process.env[variable];

    if (!value) {
        return defaultValue;
    }

    const number = Number(value);
    if (Number.isNaN(number)) {
        throw new Error(`${variable} is not a valid number`);
    }

    return number;
};

