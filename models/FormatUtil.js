export class FormatUtil {

    static formatCurrency(currency) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currency)
    }

    static formatNumber(number) {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            .format(number)
    }
}