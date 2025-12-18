export const deductionCalculator = (grossSalary, basicSalary) => {
    let pf = basicSalary * 0.12;
    if (pf > 1800) pf = 1800;
    
    const tax = grossSalary > 25000 ? grossSalary * 0.05 : 0;
    const netSalary = grossSalary - pf - tax;

    return {
        pf: Number(pf.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        netSalary: Number(netSalary.toFixed(2)),
    };
};