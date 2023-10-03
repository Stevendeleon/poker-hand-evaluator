import { getPrimeProductFromRankbits, PlayingCard } from "@/card.ts";
import { combinations } from "@/util.ts";

type NumberMap = { [key: number]: number };

export class LookupTable {
    static MAX_ROYAL_FLUSH = 1;
    static MAX_STRAIGHT_FLUSH = 10;
    static MAX_FOUR_OF_A_KIND = 166;
    static MAX_FULL_HOUSE = 322;
    static MAX_FLUSH = 1599;
    static MAX_STRAIGHT = 1609;
    static MAX_THREE_OF_A_KIND = 2467;
    static MAX_TWO_PAIR = 3325;
    static MAX_PAIR = 6185;
    static MAX_HIGH_CARD = 7462;

    flushLookup: NumberMap = {};
    unsuitedLookup: NumberMap = {};

    constructor() {
        this.flushes();
        this.multiples();
    }

    flushes() {
        const straightFlushes = [
            7936,  // Royal flush
            3968,
            1984,
            992,
            496,
            248,
            124,
            62,
            31,
            4111  // 5 high
        ];

        const flushes: number[] = [];
        const nextSequence = this.getLexographicallyNextBitSequence(0b11111);

        let gen = nextSequence.next();

        for (let i = 0; i < 1277 + straightFlushes.length - 1; i++) {
            const f = gen.value;

            let notSF = true;
            for (const sf of straightFlushes) {
                if (!(f ^ sf)) {
                    notSF = false;
                    break;
                }
            }

            if (notSF) {
                flushes.push(f);
            }

            gen = nextSequence.next();
        }

        flushes.reverse();

        let rank = 1;
        for (const sf of straightFlushes) {
            const primeProduct = getPrimeProductFromRankbits(sf);
            this.flushLookup[primeProduct] = rank;
            rank++;
        }

        rank = LookupTable.MAX_FULL_HOUSE + 1;
        for (const f of flushes) {
            const primeProduct = getPrimeProductFromRankbits(f);
            this.flushLookup[primeProduct] = rank;
            rank++;
        }

        this.straightAndHighcards(straightFlushes, flushes);
    }


    straightAndHighcards(straights: number[], highcards: number[]) {
        let rank = LookupTable.MAX_FLUSH + 1;

        for (const s of straights) {
            const primeProduct = getPrimeProductFromRankbits(s);
            this.unsuitedLookup[primeProduct] = rank;
            rank++;
        }

        rank = LookupTable.MAX_PAIR + 1;
        for (const h of highcards) {
            const primeProduct = getPrimeProductFromRankbits(h);
            this.unsuitedLookup[primeProduct] = rank;
            rank++;
        }
    }


    multiples() {
        const backwardsRanks = Array.from({ length: 13 }, (_, i) => i).reverse();

        // 1) Four of a Kind
        let rank = LookupTable.MAX_STRAIGHT_FLUSH + 1;
        for (const i of backwardsRanks) {
            const kickers = backwardsRanks.filter(x => x !== i);
            for (const k of kickers) {
                const product = Math.pow(PlayingCard.PRIME_NUMBERS[i], 4) * PlayingCard.PRIME_NUMBERS[k];
                this.unsuitedLookup[product] = rank;
                rank++;
            }
        }

        // 2) Full House
        rank = LookupTable.MAX_FOUR_OF_A_KIND + 1;
        for (const i of backwardsRanks) {
            const pairranks = backwardsRanks.filter(x => x !== i);
            for (const pr of pairranks) {
                const product = Math.pow(PlayingCard.PRIME_NUMBERS[i], 3) * Math.pow(PlayingCard.PRIME_NUMBERS[pr], 2);
                this.unsuitedLookup[product] = rank;
                rank++;
            }
        }

        // 3) Three of a Kind
        rank = LookupTable.MAX_STRAIGHT + 1;
        for (const r of backwardsRanks) {
            const kickers = backwardsRanks.filter(x => x !== r);
            const gen = combinations(kickers, 2);
            let kickers2Combo: any;
            while (kickers2Combo === gen.next()) {
                const [c1, c2] = kickers2Combo;
                const product = Math.pow(PlayingCard.PRIME_NUMBERS[r], 3) * PlayingCard.PRIME_NUMBERS[c1] * PlayingCard.PRIME_NUMBERS[c2];
                this.unsuitedLookup[product] = rank;
                rank++;
            }
        }

        // 4) Two Pair
        rank = LookupTable.MAX_THREE_OF_A_KIND + 1;
        const tpGen = combinations(backwardsRanks, 2);
        let tp: any;
        while (tp === tpGen.next()) {
            const [pair1, pair2] = tp;
            const kickers = backwardsRanks.filter(x => x !== pair1 && x !== pair2);
            for (const kicker of kickers) {
                const product = Math.pow(PlayingCard.PRIME_NUMBERS[pair1], 2) * Math.pow(PlayingCard.PRIME_NUMBERS[pair2], 2) * PlayingCard.PRIME_NUMBERS[kicker];
                this.unsuitedLookup[product] = rank;
                rank++;
            }
        }

        // 5) Pair
        rank = LookupTable.MAX_TWO_PAIR + 1;
        for (const pairrank of backwardsRanks) {
            const kickers = backwardsRanks.filter(x => x !== pairrank);
            const kGen = combinations(kickers, 3);
            let kickers3Combo: any;
            while (kickers3Combo === kGen.next()) {
                const [k1, k2, k3] = kickers3Combo;
                const product = Math.pow(PlayingCard.PRIME_NUMBERS[pairrank], 2) * PlayingCard.PRIME_NUMBERS[k1] * PlayingCard.PRIME_NUMBERS[k2] * PlayingCard.PRIME_NUMBERS[k3];
                this.unsuitedLookup[product] = rank;
                rank++;
            }
        }
    }

    *getLexographicallyNextBitSequence(bits: number): Generator<number> {
        let t = (bits | (bits - 1)) + 1;
        let next = t | ((((t & -t) / (bits & -bits)) >> 1) - 1);

        yield next;

        while (true) {
            t = (next | (next - 1)) + 1;
            next = t | ((((t & -t) / (next & -next)) >> 1) - 1);
            yield next;
        }
    }
}



