import Utils from './utils';

export class Deck {
    readonly defaultCards = {
        x0: 1,
        '-2': 1,
        '-1': 5,
        '+0': 6,
        '+1': 5,
        '+2': 1,
        '+3': 0,
        '+4': 0,
        x2: 1,
        'r+1': 0,
        'r+2': 0,
    };

    readonly defaultEffects = {
        None: 20,
        'Add Target': 0,
        'Heal 2': 0,
        'Push 1': 0,
        'Refresh an item': 0,
        'Rolling Add Target': 0,
        'Rolling Curse': 0,
        'Rolling Dark': 0,
        'Rolling Disarm': 0,
        'Rolling Earth': 0,
        'Rolling Fire': 0,
        'Rolling Frost': 0,
        'Rolling Heal 1': 0,
        'Rolling Heal 3': 0,
        'Rolling Immobilize': 0,
        'Rolling Invisible': 0,
        'Rolling Muddle': 0,
        'Rolling Pierce 3': 0,
        'Rolling Poison': 0,
        'Rolling Pull 1': 0,
        'Rolling Push 1': 0,
        'Rolling Push 2': 0,
        'Rolling Shield 1, Self': 0,
        'Rolling Stun': 0,
        'Rolling Sun': 0,
        'Rolling Wind': 0,
        'Rolling Wound': 0,
        'Shield 1, Self': 0,
        Curse: 0,
        Dark: 0,
        Disarm: 0,
        Earth: 0,
        Fire: 0,
        Frost: 0,
        Immobilize: 0,
        Invisible: 0,
        Muddle: 0,
        Poison: 0,
        Stun: 0,
        Wind: 0,
        Wound: 0,
    };

    private cardValue = {
        x0: -1000,
        '-2': -2,
        '-1': -1,
        '+0': 0,
        '+1': 1,
        '+2': 2,
        '+3': 3,
        '+4': 4,
        x2: 1000,
        'r+1': 1,
        'r+2': 2,
    };

    public effects: object;

    public cards: object;

    public comparison: { cards: object, effects: object };

    constructor() {
        this.cards = Utils.clone(this.defaultCards);
        this.effects = Utils.clone(this.defaultEffects);
    }

    public saveComparison(cards = this.cards, effects = this.effects) {
        this.comparison = { cards: Utils.clone(this.cards), effects: Utils.clone(this.effects) };
    }

    public clearComparisons() {
        this.comparison = undefined;
    }

    public getCardTypes(): Array<string> {
        return Object.keys(this.cards);
    }

    public sum(cards = this.cards): number {
        return Object.values(cards).reduce((prev, cur) => prev + cur);
    }

    public rollingSum(cards = this.cards): number {
        let sum = 0;
        for (const key of Object.keys(cards)) {
            sum += key.startsWith('r+') || key.startsWith('Rolling') ? cards[key] : 0;
        }
        return sum;
    }

    public nonRollingSum(cards = this.cards): number {
        let sum = 0;
        for (const key of Object.keys(cards)) {
            sum += !key.startsWith('r+') && !key.startsWith('Rolling') ? cards[key] : 0;
        }
        return sum;
    }

    public getCardsProbability(cards = this.cards, removeZero = false): object {
        const nonRollingSum = this.nonRollingSum(cards);
        const probabilities = {};

        for (const key of Object.keys(cards)) {
            const val = cards[key];
            if (val === 0 && removeZero) { continue; }
            const sum = key.startsWith('r+') || key.startsWith('Rolling') ? nonRollingSum + val : nonRollingSum;
            probabilities[key] = val / sum;
        }

        return probabilities;
    }

    private getReliability(cards = this.cards, rollingValue = 0, compareFunc: (x: number) => boolean) {
        let probability = 0;

        for (const cardType of Object.keys(cards)) {
            // Ignore cards not in deck
            if (cards[cardType] === 0) {
                continue;
            }

            if (!cardType.startsWith('r') && compareFunc(rollingValue + this.cardValue[cardType])) {
                probability += cards[cardType] / this.sum(cards);
            } else if (cardType.startsWith('r')) {
                const newCards = Object.assign({}, cards);
                newCards[cardType] -= 1;

                probability += (cards[cardType] / this.sum(cards))
                    * this.getReliability(newCards, rollingValue + this.cardValue[cardType], compareFunc);
            }
        }

        return probability;
    }

    public reliabilityNegative(cards = this.cards) {
        const compareFunc = (x: number) => x < 0;
        const probability = this.getReliability(cards, 0, compareFunc);
        return probability;
    }

    public reliabilityZero(cards = this.cards) {
        const compareFunc = (x: number) => x === 0;
        const probability = this.getReliability(cards, 0, compareFunc);
        return probability;
    }

    public reliabilityPositive(cards = this.cards) {
        const compareFunc = (x: number) => x > 0;
        const probability = this.getReliability(cards, 0, compareFunc);
        return probability;
    }

    public getEffectsProbability(effects = this.effects) {
        const probabilities = {};
        const sum = this.sum(effects);

        for (const key of Object.keys(effects)) {
            const label = key.replace('Rolling ', '').trim();
            if (effects[key] === 0) { continue; }

            if (key.startsWith('Rolling')) {
                const newEffects = Utils.clone(effects);
                const mult = effects[key] / sum;
                newEffects[key] -= 1;

                const newProbabilities = this.getEffectsProbability(newEffects);
                if (Utils.equals(newProbabilities, {})) {
                    probabilities[label] = (probabilities[label] || 0) + mult;
                }
                for (const newLabel of Object.keys(newProbabilities)) {
                    probabilities[label] = (probabilities[label] || 0) + mult * newProbabilities[newLabel];
                    if (newLabel !== label && newLabel !== 'None') {
                        probabilities[newLabel] = (probabilities[newLabel] || 0) + mult * newProbabilities[newLabel];
                    }
                }
            } else {
                probabilities[label] = (probabilities[label] || 0) + effects[key] / sum;
            }

        }
        return probabilities;
    }

    public getEffectsProbability_old2(effects = this.effects, probabilities = {}, mult = 1, prevLabels = []): object {
        const sum = this.sum(effects);

        if (effects['None'] !== 0 && !('None' in probabilities)) {
            probabilities['None'] = effects['None'] / sum;
            // effects['None'] = 0;
        }


        for (const key of Object.keys(effects)) {
            const label = key.replace('Rolling ', '').trim();
            if (effects[key] === 0 || prevLabels.includes(label)) { continue; }


            if (key.startsWith('Rolling')) {
                const newEffects = Utils.clone(effects);
                const newMult = effects[key] / sum; // Used for other multiplications
                const newLabels = Utils.clone(prevLabels);
                newEffects[key] -= 1;
                newLabels.push(label);

                probabilities[label] = (probabilities[label] || 0) + mult * (effects[key] / sum);
                const newProbabilities = this.getEffectsProbability_old2(newEffects, {}, newMult, newLabels);
                console.log(newProbabilities);
            } else if (key !== 'None') {
                probabilities[label] = (probabilities[label] || 0) + mult * (effects[key] / sum);
            }
        }

        return probabilities;
    }

    public getEffectsProbability_old(effects = this.effects, probabilities = {}, mult = 1, prevLabels = []): object {
        effects = Utils.clone(effects);
        const sum = this.sum(effects);
        console.log(`SUM: ${sum}`);

        if (effects['None'] !== 0 && !('None' in probabilities)) {
            probabilities['None'] = effects['None'] / sum;
            // effects['None'] = 0;
        }


        for (const key of Object.keys(effects)) {
            const label = key.replace('Rolling ', '').trim();
            if (effects[key] === 0 || prevLabels.includes(label)) { continue; }


            if (key.startsWith('Rolling')) {
                const newEffects = Utils.clone(effects);
                const newMult = effects[key] / sum; // Used for other multiplications
                const newLabels = Utils.clone(prevLabels);
                newEffects[key] -= 1;
                newLabels.push(label);

                probabilities[label] = (probabilities[label] || 0) + mult * (effects[key] / sum);
                probabilities = this.getEffectsProbability_old(newEffects, probabilities, newMult, newLabels);
            } else if (key !== 'None') {
                probabilities[label] = (probabilities[label] || 0) + mult * (effects[key] / sum);
            }
        }

        return probabilities;
    }

    public getAverageDamage(baseDamage: number, cards = this.cards): number {
        let damage = 0;
        const sum = this.sum(cards);

        for (const key of Object.keys(cards)) {
            if (cards[key] === 0 || key === 'x0') { continue; }
            if (key.startsWith('r')) {
                const newCards = Object.assign({}, cards);
                newCards[key] -= 1;
                damage += (this.cardValue[key] + this.getAverageDamage(baseDamage, newCards)) * (cards[key] / sum);
            } else if (key === 'x2') {
                damage += (baseDamage * 2) * (cards[key] / sum);
            } else {
                let tmpDamage = (baseDamage + this.cardValue[key]);
                tmpDamage = tmpDamage > 0 ? tmpDamage : 0;
                damage += (tmpDamage) * (cards[key] / sum);
            }
        }
        return damage;
    }

    public addCard(cardType: string, cardEffect: string, count = 1) {
        this.cards[cardType] += count;
        this.effects[cardEffect] += count;
    }

    public removeCard(cardType: string, cardEffect: string, count = 1) {
        this.cards[cardType] -= count;
        this.effects[cardEffect] -= count;
    }

    public reset() {
        this.cards = Utils.clone(this.defaultCards);
        this.effects = Utils.clone(this.defaultEffects);
    }
}
