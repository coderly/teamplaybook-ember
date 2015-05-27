import DS from 'ember-data';

var Page = DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  children: DS.hasMany('pages', {inverse: 'parent'}),
  parent: DS.belongsTo('page'),
  rootNode: DS.attr('boolean'),
  parentId: DS.attr('number')
});

// Page.reopenClass({
//   FIXTURES: [
//     {
//       id: 1,
//       title: "Westeros",
//       body: "Fake place from a book series for nerds",
//       children: [2,3,4],
//       root: true
//     },
//     {
//       id: 2,
//       title: "The North",
//       body: "It's really cold",
//       children: [5, 6]
//     },
//     {
//       id: 3,
//       title: "The Riverlands",
//       body: "It has a lot of water",
//       children: [7]
//     },
//     {
//       id: 4,
//       title: "Dorne",
//       body: "It's full of sand",
//       children: [8, 9]
//     },
//     {
//       id: 5,
//       title: "Winterfell",
//       body: "Home of the house Stark"
//     },
//     {
//       id: 6,
//       title: "The Wall",
//       body: "A Huge wall made of ice to protect the realm"
//     },
//     {
//       id: 7,
//       title: "RiverRun",
//       body: "Home of the house Tully"
//     },
//     {
//       id: 8,
//       title: "Sunspear",
//       body: "Home of the house Martell"
//     },
//     {
//       id: 9,
//       title: "Water Gardens",
//       body: "Private residence of house Martell"
//     }
//   ]
// });

export default Page;
