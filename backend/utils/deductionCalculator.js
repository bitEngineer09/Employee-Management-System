export const deductionCalculator = (gross, basic) => {
    const pf = basic * 0.12;
    const tax = gross * 0.05;
    const netSalary = gross - pf - tax;

    return {
        pf: Number(pf.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        netSalary: Number(netSalary.toFixed(2)),
    };
};