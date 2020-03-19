const {
    DateTimeResolver,
    EmailAddressResolver,
    NegativeFloatResolver,
    NegativeIntResolver,
    NonNegativeFloatResolver,
    NonNegativeIntResolver,
    NonPositiveFloatResolver,
    NonPositiveIntResolver,
    PhoneNumberResolver,
    PositiveFloatResolver,
    PositiveIntResolver,
    PostalCodeResolver,
    UnsignedFloatResolver,
    UnsignedIntResolver,
    BigIntResolver,
    URLResolver,
    LongResolver,
    GUIDResolver,
    HexColorCodeResolver,
    HSLResolver,
    HSLAResolver,
    IPv4Resolver,
    IPv6Resolver,
    ISBNResolver,
    MACResolver,
    PortResolver,
    RGBResolver,
    RGBAResolver,
    USCurrencyResolver,
    JSONResolver,
    JSONObjectResolver,
    ObjectIDResolver,
} = require('graphql-scalars');

const resolvers = {
    ObjectID: ObjectIDResolver,

    DateTime: DateTimeResolver,

    NonPositiveInt: NonPositiveIntResolver,
    PositiveInt: PositiveIntResolver,
    NonNegativeInt: NonNegativeIntResolver,
    NegativeInt: NegativeIntResolver,
    NonPositiveFloat: NonPositiveFloatResolver,
    PositiveFloat: PositiveFloatResolver,
    NonNegativeFloat: NonNegativeFloatResolver,
    NegativeFloat: NegativeFloatResolver,
    UnsignedFloat: UnsignedFloatResolver,
    UnsignedInt: UnsignedIntResolver,
    BigInt: BigIntResolver,
    Long: LongResolver,

    EmailAddress: EmailAddressResolver,
    URL: URLResolver,
    PhoneNumber: PhoneNumberResolver,
    PostalCode: PostalCodeResolver,

    GUID: GUIDResolver,

    HexColorCode: HexColorCodeResolver,
    HSL: HSLResolver,
    HSLA: HSLAResolver,
    RGB: RGBResolver,
    RGBA: RGBAResolver,

    IPv4: IPv4Resolver,
    IPv6: IPv6Resolver,
    MAC: MACResolver,
    Port: PortResolver,

    ISBN: ISBNResolver,

    USCurrency: USCurrencyResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
};

const typeDefs = `
scalar DateTime

scalar EmailAddress

scalar NegativeFloat

scalar NegativeInt

scalar NonNegativeFloat

scalar NonNegativeInt

scalar NonPositiveFloat

scalar NonPositiveInt

scalar PhoneNumber

scalar PositiveFloat

scalar PositiveInt

scalar PostalCode

scalar UnsignedFloat

scalar UnsignedInt

scalar URL

scalar ObjectID

scalar BigInt

scalar Long

scalar GUID

scalar HexColorCode

scalar HSL

scalar HSLA

scalar IPv4

scalar IPv6

scalar ISBN

scalar MAC

scalar Port

scalar RGB

scalar RGBA

scalar USCurrency

scalar JSON

scalar JSONObject
`;

const scalars: { [key: string]: any } = {
    typeDefs,
    resolvers,
};

export default scalars;