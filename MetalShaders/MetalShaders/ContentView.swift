import SwiftUI

struct ContentView: View {
    @State private var shaders: [ShaderData] = []
    @State private var searchText = ""

    private var filteredShaders: [ShaderData] {
        if searchText.isEmpty { return shaders }
        return shaders.filter {
            $0.meta.title.localizedCaseInsensitiveContains(searchText) ||
            $0.meta.description.localizedCaseInsensitiveContains(searchText) ||
            $0.meta.tags.contains { $0.localizedCaseInsensitiveContains(searchText) }
        }
    }

    private let columns = [
        GridItem(.adaptive(minimum: 300, maximum: 500), spacing: 20)
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(filteredShaders) { shader in
                        NavigationLink(value: shader.meta) {
                            ShaderCardView(shader: shader)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(20)
            }
            .navigationTitle("Metal Shaders")
            .searchable(text: $searchText, prompt: "Search shaders")
            .navigationDestination(for: ShaderMeta.self) { meta in
                if let shader = shaders.first(where: { $0.meta.slug == meta.slug }) {
                    ShaderDetailView(shader: shader)
                }
            }
        }
        .onAppear {
            shaders = ShaderLoader.loadAllShaders()
        }
    }
}

struct ShaderCardView: View {
    let shader: ShaderData

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ShaderPreviewView(
                metalSource: shader.metalSource,
                fragmentFunctionName: shader.fragmentFunctionName,
                preferredFPS: 30
            )
            .aspectRatio(4 / 3, contentMode: .fit)

            VStack(alignment: .leading, spacing: 6) {
                Text(shader.meta.title)
                    .font(.headline)

                Text(shader.meta.description)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)

                HStack(spacing: 6) {
                    ForEach(shader.meta.tags, id: \.self) { tag in
                        Text(tag)
                            .font(.caption2)
                            .fontWeight(.medium)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(.fill.tertiary, in: .capsule)
                    }
                }
            }
            .padding(12)
        }
        .background(.background.secondary)
        .clipShape(.rect(cornerRadius: 16))
        .shadow(color: .black.opacity(0.08), radius: 8, y: 4)
    }
}

#Preview {
    ContentView()
}
