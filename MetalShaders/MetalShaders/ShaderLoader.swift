import Foundation

struct ShaderLoader {
    static func shadersDirectory() -> URL? {
        let sourceFile = URL(fileURLWithPath: #filePath)
        let projectRoot = sourceFile
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
        let shadersDir = projectRoot.appendingPathComponent("public/shaders")
        guard FileManager.default.fileExists(atPath: shadersDir.path) else {
            return nil
        }
        return shadersDir
    }

    static func loadIndex() -> [ShaderMeta] {
        guard let dir = shadersDirectory() else { return [] }
        let indexURL = dir.appendingPathComponent("index.json")
        guard let data = try? Data(contentsOf: indexURL) else { return [] }

        struct Index: Codable {
            let shaders: [ShaderMeta]
        }

        guard let index = try? JSONDecoder().decode(Index.self, from: data) else {
            return []
        }
        return index.shaders
    }

    static func loadShaderData(slug: String) -> ShaderData? {
        guard let dir = shadersDirectory() else { return nil }
        let shaderDir = dir.appendingPathComponent(slug)

        guard
            let metaData = try? Data(contentsOf: shaderDir.appendingPathComponent("meta.json")),
            let meta = try? JSONDecoder().decode(ShaderMeta.self, from: metaData),
            let metalSource = try? String(contentsOf: shaderDir.appendingPathComponent("shader.metal"), encoding: .utf8),
            let fragSource = try? String(contentsOf: shaderDir.appendingPathComponent("shader.frag"), encoding: .utf8)
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
