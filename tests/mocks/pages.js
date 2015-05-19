var listOfPages = {
  data: [
    {
      id: 1,
      type: "page",
      title: "Westeros",
      body: "Fake place from a book series for nerds",
      root: true,
      links: { 
        children: {
          linkage: [
            { type: "page", "id": "2" },
            { type: "page", "id": "3" },
            { type: "page", "id": "4" }
          ]
        }
      }
    },
    {
      id: 2,
      type: "page",
      title: "The North",
      body: "It's really cold",
      links: { 
        children: {
          linkage: [
            { type: "page", "id": "5" },
            { type: "page", "id": "6" }
          ]
        }
      }
    },
    {
      id: 3,
      type: "page",
      title: "The Riverlands",
      body: "It has a lot of water",
      links: { 
        children: {
          linkage: [
            { type: "page", "id": "7" }
          ]
        }
      }
    },
    {
      id: 4,
      title: "Dorne",
      type: "page",
      body: "It's full of sand",
      links: { 
        children: {
          linkage: [
            { type: "page", "id": "8" },
            { type: "page", "id": "9" }
          ]
        }
      }
    },
    {
      id: 5,
      type: "page",
      title: "Winterfell",
      body: "Home of the house Stark"
    },
    {
      id: 6,
      type: "page",
      title: "The Wall",
      body: "A Huge wall made of ice to protect the realm"
    },
    {
      id: 7,
      type: "page",
      title: "RiverRun",
      body: "Home of the house Tully"
    },
    {
      id: 8,
      type: "page",
      title: "Sunspear",
      body: "Home of the house Martell"
    },
    {
      id: 9,
      type: "page",
      title: "Water Gardens",
      body: "Private residence of house Martell"
    }
  ]
};

export default listOfPages;