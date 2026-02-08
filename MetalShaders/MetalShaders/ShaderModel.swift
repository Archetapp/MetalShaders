import Foundation

struct ShaderMeta: Codable, Identifiable, Hashable {
    var id: String { slug }
    let slug: String
    let title: String
    let description: String
    let tags: [String]
    let author: String
    let date: String
}

struct ShaderData: Identifiable {
    var id: String { meta.slug }
    let meta: ShaderMeta
    let metalSource: String
    let fragSource: String
    let fragmentFunctionName: String
}
