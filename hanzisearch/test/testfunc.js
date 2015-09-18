/**
 * Created by cdpmac on 15/9/16.
 */

var hanzisearch=require('../index');

console.log(hanzisearch.ToPinyin("小"));
console.log(JSON.stringify(hanzisearch.ToHanZi("da")) );
console.log(JSON.stringify(hanzisearch.getAllLikeNames("小明")) );

