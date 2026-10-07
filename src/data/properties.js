/**
 * The property records. One entry is everything the site knows about a listing:
 * the card reads the top of it, the detail page reads all of it.
 *
 * `images` is a set of three per listing because the card's frame cycles them —
 * see `PropertyGallery`. Give it one and the cycling stops; give it five and it
 * walks all five. Nothing in the UI assumes three.
 *
 * The three files in `public/images/properties/` are placeholders standing in
 * for real photography, so every listing is pointed at the same set. When the
 * real shoot lands, give each one its own `images` array — no component
 * changes.
 */
const PLACEHOLDER_IMAGES = [
  "/images/properties/property-one.webp",
  "/images/properties/property-two.webp",
  "/images/properties/property-three.webp",
];

export const propertiesHeading = {
  title: "Homes we have stood inside",
  description:
    "Every one of these was visited, measured and photographed by our own team before it went live. What you see is what is there.",
  action: { label: "Browse all properties", href: "/properties" },
};

/**
 * Card-level fields
 * -----------------
 * `status` picks the badge tone: "sale" is the brand, "rent" the gold accent.
 * Keep it to those two — the mapping lives in `PropertyCard`.
 *
 * `description` is the one line under the heading. Keep it to roughly this
 * length: the card clamps it at three lines and a longer one is simply cut.
 *
 * `featured` adds the second badge over the photograph, and is also what puts
 * the listing in the `FeaturedItems` slider.
 *
 * `type` is the machine value the listing page filters on — apartment, house,
 * villa, duplex. The human wording lives in `facts` ("Detached villa"), which is
 * display copy and the wrong thing to match against.
 *
 * `price` is what the listing is asking. `discountPrice` is optional — set it
 * and both the card and the detail page show it as the live figure with `price`
 * struck through beside it.
 *
 * Detail-page fields
 * ------------------
 * `agentId` points at an entry in `agents.js`, so a listing and the person
 * responsible for it are joined by id rather than by repeated copy.
 *
 * `overview` is one paragraph per array entry. `facts` and `additional` are
 * both `{ label, value }` rows — facts describe the building, additional
 * describes the listing. `features` is a plain list.
 *
 * `reviews` carry their own ratings, and the page derives the average and the
 * star distribution from them. Storing a second aggregate figure would only
 * give it something to drift out of agreement with.
 */
export const properties = [
  {
    id: "gulshan-modern-villa",
    type: "villa",
    featured: true,
    title: "Modern Villa",
    location: "Gulshan 2, Dhaka",
    href: "/properties/gulshan-modern-villa",
    status: "sale",
    price: "৳ 5,200,000",
    discountPrice: "৳ 4,850,000",
    beds: 5,
    baths: 4,
    area: "4,000 sqft",
    images: PLACEHOLDER_IMAGES,
    description:
      "Double-height glazing across the front, a walled courtyard behind, and covered parking for three.",
    alt: "Modern villa with a glazed double-height frontage",
    agentId: "arif-rahman",
    overview: [
      "A detached villa on a corner plot, built in 2019 and lived in by one family since. The front elevation is glazed across both storeys, which makes the main reception unusually bright for the street — the tree line opposite keeps it from overheating in the afternoon.",
      "Behind the house is a walled courtyard laid to stone with mature planting on two sides. The garage takes three cars under cover, with a separate service entrance into the kitchen.",
    ],
    facts: [
      { icon: "building", label: "Type", value: "Detached villa" },
      { icon: "calendar", label: "Year built", value: "2019" },
      { icon: "layers", label: "Floors", value: "2 plus roof" },
      { icon: "car", label: "Parking", value: "3 covered" },
      { icon: "sofa", label: "Furnishing", value: "Unfurnished" },
      { icon: "compass", label: "Facing", value: "South-east" },
    ],
    features: [
      "Double-height reception",
      "Walled stone courtyard",
      "Covered parking for three",
      "Standby generator",
      "Solar hot water",
      "Staff quarter with own entrance",
      "CCTV to all approaches",
      "Rainwater harvesting",
    ],
    additional: [
      { label: "Listing ID", value: "ADE-1042" },
      { label: "Listed on", value: "12 June 2026" },
      { label: "Last verified by us", value: "4 August 2026" },
      { label: "Ownership", value: "Freehold" },
      { label: "Service charge", value: "None" },
      { label: "Council rates", value: "৳ 34,000 a year" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Farhana Islam",
        context: "Viewed in July 2026",
        rating: 5,
        body: "The photographs are honest, which is rarer than it should be. The courtyard is as private as it looks and the reception is as bright. Arif had the survey and the rates bill ready before we asked.",
      },
      {
        id: "r2",
        author: "Rezaul Karim",
        context: "Viewed in July 2026",
        rating: 4,
        body: "Beautiful house. Worth knowing the road gets busy at school run — not a problem for us, but ask whether it would be for you.",
      },
      {
        id: "r3",
        author: "Shirin Akter",
        context: "Bought nearby in 2025",
        rating: 5,
        body: "We looked at this one before buying two streets over. The build quality is a step above most of what is on the market at this price.",
      },
    ],
  },
  {
    id: "banani-garden-house",
    type: "house",
    featured: true,
    title: "Garden House",
    location: "Banani, Dhaka",
    href: "/properties/banani-garden-house",
    status: "rent",
    price: "৳ 3,500,000",
    beds: 4,
    baths: 3,
    area: "3,200 sqft",
    images: PLACEHOLDER_IMAGES,
    description:
      "Set back behind its own lawn on a quiet through-road, with a south-facing terrace off the first floor.",
    alt: "Two-storey house set back behind a walled garden",
    agentId: "imran-chowdhury",
    overview: [
      "Two storeys set back about twelve metres from the road behind a lawn and a low wall, which is what keeps the ground floor quiet on a street that carries some traffic. Let unfurnished on a minimum twelve-month term.",
      "The first floor opens onto a south-facing terrace deep enough to eat on. Kitchen and utility sit at the back, away from the reception rooms.",
    ],
    facts: [
      { icon: "building", label: "Type", value: "Semi-detached house" },
      { icon: "calendar", label: "Year built", value: "2014" },
      { icon: "layers", label: "Floors", value: "2" },
      { icon: "car", label: "Parking", value: "2 open" },
      { icon: "sofa", label: "Furnishing", value: "Unfurnished" },
      { icon: "compass", label: "Facing", value: "South" },
    ],
    features: [
      "South-facing first-floor terrace",
      "Private front lawn",
      "Separate utility room",
      "Standby generator",
      "Two open parking bays",
      "Gated street with guard",
    ],
    additional: [
      { label: "Listing ID", value: "ADE-1088" },
      { label: "Listed on", value: "2 July 2026" },
      { label: "Last verified by us", value: "18 August 2026" },
      { label: "Minimum term", value: "12 months" },
      { label: "Deposit", value: "2 months, protected" },
      { label: "Service charge", value: "Included in rent" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Nusrat Jahan",
        context: "Renting since August 2026",
        rating: 5,
        body: "We moved in last month. The set-back really does work — you forget the road is there. The deposit went into the protection scheme the same week, which is why we went with Adestate.",
      },
      {
        id: "r2",
        author: "Tanjil Hasan",
        context: "Viewed in July 2026",
        rating: 4,
        body: "Good house, fair rent for Banani. The second bathroom is small, so see it in person if that matters to you.",
      },
    ],
  },
  {
    id: "baridhara-timber-residence",
    type: "house",
    featured: true,
    title: "Timber Residence",
    location: "Baridhara DOHS, Dhaka",
    href: "/properties/baridhara-timber-residence",
    status: "sale",
    price: "৳ 6,400,000",
    discountPrice: "৳ 5,975,000",
    beds: 6,
    baths: 5,
    area: "5,100 sqft",
    images: PLACEHOLDER_IMAGES,
    description:
      "Timber and glass over three storeys, with a roof terrace and a lift serving every floor.",
    alt: "Timber-clad residence lit at dusk with a covered carport",
    agentId: "tanvir-ahmed",
    overview: [
      "The largest house we currently hold in DOHS. Timber-clad over three storeys with a passenger lift serving every floor including the roof, which makes the top terrace genuinely usable rather than somewhere you visit twice a year.",
      "Six bedrooms, five of them with their own bathroom. The ground floor is arranged for entertaining, with a kitchen opening onto a covered side terrace and a carport that takes two cars out of the weather.",
    ],
    facts: [
      { icon: "building", label: "Type", value: "Detached house" },
      { icon: "calendar", label: "Year built", value: "2021" },
      { icon: "layers", label: "Floors", value: "3 plus roof terrace" },
      { icon: "car", label: "Parking", value: "2 covered, 2 open" },
      { icon: "sofa", label: "Furnishing", value: "Part furnished" },
      { icon: "compass", label: "Facing", value: "North-east" },
    ],
    features: [
      "Passenger lift to every floor",
      "Roof terrace with services run",
      "Five en-suite bedrooms",
      "Covered carport",
      "Standby generator",
      "Underfloor heating to bathrooms",
      "Timber rainscreen cladding",
      "Staff quarter and store",
    ],
    additional: [
      { label: "Listing ID", value: "ADE-0977" },
      { label: "Listed on", value: "28 May 2026" },
      { label: "Last verified by us", value: "1 August 2026" },
      { label: "Ownership", value: "Freehold" },
      { label: "Service charge", value: "None" },
      { label: "Council rates", value: "৳ 51,000 a year" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Imtiaz Ahmed",
        context: "Viewed in August 2026",
        rating: 5,
        body: "The lift to the roof is the thing that sells it. We have seen four houses this size and this is the only one where the top floor is somewhere you would actually sit.",
      },
      {
        id: "r2",
        author: "Sadia Rahman",
        context: "Viewed in June 2026",
        rating: 5,
        body: "Immaculate. The timber has been maintained properly, which you cannot say of most cladding in this city after five years.",
      },
      {
        id: "r3",
        author: "Khalid Mahmud",
        context: "Viewed in June 2026",
        rating: 4,
        body: "Lovely house, priced accordingly. Running costs on a place this size are real — ask for the last year of bills, they will give them to you.",
      },
    ],
  },
  {
    id: "dhanmondi-lakeview-apartment",
    type: "apartment",
    featured: true,
    title: "Lakeview Apartment",
    location: "Dhanmondi 27, Dhaka",
    href: "/properties/dhanmondi-lakeview-apartment",
    status: "rent",
    price: "৳ 2,400,000",
    beds: 3,
    baths: 2,
    area: "1,850 sqft",
    images: PLACEHOLDER_IMAGES,
    description:
      "Sixth floor with the lake on two sides, a service lift, and a generator covering the whole block.",
    alt: "Apartment living room with floor-to-ceiling windows over a lake",
    agentId: "sabbir-hossain",
    overview: [
      "A corner flat on the sixth floor with windows onto the lake on two sides, which means light through the day rather than for an hour. The block has a passenger lift and a separate service lift, and the generator covers every flat rather than only the common parts.",
      "Three bedrooms, the main one with its own bathroom. Let unfurnished with white goods left in place.",
    ],
    facts: [
      { icon: "building", label: "Type", value: "Apartment" },
      { icon: "calendar", label: "Year built", value: "2017" },
      { icon: "layers", label: "Floor", value: "6th of 9" },
      { icon: "car", label: "Parking", value: "1 allocated" },
      { icon: "sofa", label: "Furnishing", value: "Unfurnished, white goods" },
      { icon: "compass", label: "Facing", value: "West and north" },
    ],
    features: [
      "Lake views on two elevations",
      "Passenger and service lifts",
      "Block-wide standby generator",
      "Allocated basement parking",
      "En-suite to main bedroom",
      "Concierge at the entrance",
    ],
    additional: [
      { label: "Listing ID", value: "ADE-1131" },
      { label: "Listed on", value: "9 August 2026" },
      { label: "Last verified by us", value: "22 August 2026" },
      { label: "Minimum term", value: "12 months" },
      { label: "Deposit", value: "2 months, protected" },
      { label: "Service charge", value: "৳ 9,000 a month" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Maria Chowdhury",
        context: "Viewed in August 2026",
        rating: 5,
        body: "The corner position is everything — two aspects onto the lake, and you hear the water rather than the road. The service charge is fair for what the block actually provides.",
      },
      {
        id: "r2",
        author: "Arnab Sen",
        context: "Viewed in August 2026",
        rating: 4,
        body: "Very good flat. Only one allocated parking bay, so check that against your household before you commit.",
      },
    ],
  },
  {
    id: "uttara-courtyard-duplex",
    type: "duplex",
    featured: false,
    title: "Courtyard Duplex",
    location: "Uttara Sector 7, Dhaka",
    href: "/properties/uttara-courtyard-duplex",
    status: "sale",
    price: "৳ 4,100,000",
    discountPrice: "৳ 3,850,000",
    beds: 5,
    baths: 4,
    area: "3,600 sqft",
    images: PLACEHOLDER_IMAGES,
    description:
      "Two floors around an open courtyard, with a separate driver's quarter and parking for four cars.",
    alt: "Duplex house arranged around a planted internal courtyard",
    agentId: "arif-rahman",
    overview: [
      "A duplex arranged around an open internal courtyard, so every principal room draws light from two directions and the middle of the plan is not the dark spot it usually is in a house this deep.",
      "Parking for four with a separate quarter off the gate. The asking price has come down once since listing, and the vendor has already moved out.",
    ],
    facts: [
      { icon: "building", label: "Type", value: "Duplex" },
      { icon: "calendar", label: "Year built", value: "2016" },
      { icon: "layers", label: "Floors", value: "2" },
      { icon: "car", label: "Parking", value: "4 open" },
      { icon: "sofa", label: "Furnishing", value: "Unfurnished" },
      { icon: "compass", label: "Facing", value: "East" },
    ],
    features: [
      "Open internal courtyard",
      "Separate quarter off the gate",
      "Parking for four",
      "Standby generator",
      "Deep water reserve tank",
      "Gated sector with patrol",
    ],
    additional: [
      { label: "Listing ID", value: "ADE-1005" },
      { label: "Listed on", value: "3 June 2026" },
      { label: "Last verified by us", value: "11 August 2026" },
      { label: "Ownership", value: "Freehold" },
      { label: "Service charge", value: "None" },
      { label: "Chain", value: "None, vendor has moved" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Tahmid Alam",
        context: "Viewed in August 2026",
        rating: 4,
        body: "The courtyard does exactly what it is meant to. Sector 7 is a longer run into town than it looks on the map, which is the trade for the space.",
      },
      {
        id: "r2",
        author: "Rumana Haque",
        context: "Viewed in July 2026",
        rating: 5,
        body: "Empty and ready, no chain, and the price already reflects that. We are in a chain ourselves or we would have offered.",
      },
    ],
  },
];
