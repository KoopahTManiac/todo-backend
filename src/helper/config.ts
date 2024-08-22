export const validateEnvString = ( variable: string ): string => {
    const value = process.env[variable];

    if (!value) {
        throw new Error(`${variable} is not set`);
    }

    return value;
}

export const validateEnvNumber = ( variable: string ): number => {
    const value = process.env[variable];
    if (!value) {
        throw new Error(`${variable} is not set`);
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        throw new Error(`${variable} is not a valid number`);
    }

    return number;
}

export const EnvString = (variable: string, defaultValue: string): string => {
    const value = process.env[variable];

    return value || defaultValue;
}

export const EnvNumber = (varName: string, defaultValue: number): number => {
    const value = process.env[varName];

    if (!value) {
        return defaultValue;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        throw new Error(`${varName} is not a valid number`);
    }

    return number;
}


