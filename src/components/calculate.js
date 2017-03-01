import infoTree from './infoTree';

export default {

    setDefaultWeight(id) {
        console.log(infoTree);
        let sonIds = infoTree[id].sonIds;
        let remainWeight = 1;
        let idsLength = sonIds.length;
        for(let sonId of sonIds) {
            if(infoTree[sonId].weight) {
                remainWeight -= infoTree[sonId].weight;
                idsLength--;
            } else {
                console.log(this);
                return infoTree[sonId].weight = (remainWeight / idsLength).toFixed(3);
            }
        }
    },

    calculateWeight(id) {
        this.setDefaultWeight(id);
    },

    calculateValue(id, weight) {

    }
}