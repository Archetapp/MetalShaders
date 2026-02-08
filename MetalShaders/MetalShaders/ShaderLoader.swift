import Foundation

struct ShaderLoader {
    static func loadIndex() -> [ShaderMeta] {
        guard let url = Bundle.main.url(
            forResource: "index",
            withExtension: "json",
            subdirectory: "ShaderResources"
        ),
        let data = try? Data(contentsOf: url)
        else {
            return []
        }

        struct Index: Codable {
            let shaders: [ShaderMeta]
        }

        guard let index = try? JSONDecoder().decode(Index.self, from: data) else {
            return []
        }
        return index.shaders
    }

    static func loadShaderData(slug: String) -> ShaderData? {
        let subdirectory = "ShaderResources/\(slug)"

        guard
            let metaURL = Bundle.main.url(
                forResource: "meta",
                withExtension: "json",
                subdirectory: subdirectory
            ),
            let metaData = try? Data(contentsOf: metaURL),
            let meta = try? JSONDecoder().decode(ShaderMeta.self, from: metaData),
            let metalURL = Bundle.main.url(
                forResource: "shader",
                withExtension: "msl",
                subdirectory: subdirectory
            ),
            let metalSource = try? String(contentsOf: metalURL, encoding: .utf8),
            let fragURL = Bundle.main.url(
                forResource: "shader",
                withExtension: "frag",
                subdirectory: subdirectory
            ),
            let fragSource = try? String(contentsOf: fragURL, encoding: .utf8)
        else {
            return nil
        }

        let functionName = parseFragmentFunctionName(from: metalSource) ?? "unknown"

        return ShaderData(
            meta: meta,
            metalSource: metalSource,
            fragSource: fragSource,
            fragmentFunctionName: functionName
        )
    }

    static func loadAllShaders() -> [ShaderData] {
        return loadIndex().compactMap { loadShaderData(slug: $0.slug) }
    }

    private static func parseFragmentFunctionName(from source: String) -> String? {
        let pattern = #"fragment\s+float4\s+(\w+)\s*\("#
        guard let regex = try? NSRegularExpression(pattern: pattern),
              let match = regex.firstMatch(
                in: source,
                range: NSRange(source.startIndex..., in: source)
              ),
              let range = Range(match.range(at: 1), in: source)
        else {
            return nil
        }
        return String(source[range])
    }
}
