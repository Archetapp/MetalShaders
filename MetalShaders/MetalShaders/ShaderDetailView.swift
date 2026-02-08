import SwiftUI

struct ShaderDetailView: View {
    let shader: ShaderData
    @State private var selectedTab: CodeTab = .metal

    enum CodeTab: String, CaseIterable {
        case metal = "Metal"
        case glsl = "GLSL"
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                ShaderPreviewView(
                    metalSource: shader.metalSource,
                    fragmentFunctionName: shader.fragmentFunctionName
                )
                .aspectRatio(16 / 9, contentMode: .fit)
                .clipShape(.rect(cornerRadius: 16))
                .shadow(color: .black.opacity(0.1), radius: 12, y: 6)

                VStack(alignment: .leading, spacing: 8) {
                    Text(shader.meta.description)
                        .foregroundStyle(.secondary)

                    HStack(spacing: 6) {
                        ForEach(shader.meta.tags, id: \.self) { tag in
                            Text(tag)
                                .font(.caption)
                                .fontWeight(.medium)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 4)
                                .background(.fill.tertiary, in: .capsule)
                        }
                        Spacer()
                        Text("By \(shader.meta.author)")
                            .font(.caption)
                            .foregroundStyle(.tertiary)
                    }
                }

                VStack(alignment: .leading, spacing: 12) {
                    Picker("Code", selection: $selectedTab) {
                        ForEach(CodeTab.allCases, id: \.self) { tab in
                            Text(tab.rawValue).tag(tab)
                        }
                    }
                    .pickerStyle(.segmented)
                    .frame(maxWidth: 200)

                    CodeBlockView(
                        code: selectedTab == .metal ? shader.metalSource : shader.fragSource,
                        language: selectedTab == .metal ? "Metal" : "GLSL"
                    )
                }
            }
            .padding(20)
        }
        .navigationTitle(shader.meta.title)
        #if os(macOS)
        .navigationSubtitle(shader.meta.description)
        #endif
    }
}

private struct CodeBlockView: View {
    let code: String
    let language: String
    @State private var copied = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text(language)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(.secondary)
                Spacer()
                Button {
                    copyToClipboard()
                } label: {
                    Label(
                        copied ? "Copied!" : "Copy",
                        systemImage: copied ? "checkmark" : "doc.on.doc"
                    )
                    .font(.caption)
                }
                .buttonStyle(.bordered)
                .controlSize(.small)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(.fill.quaternary)

            ScrollView(.horizontal, showsIndicators: false) {
                Text(code)
                    .font(.system(.caption, design: .monospaced))
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .textSelection(.enabled)
            }
        }
        .background(.black.opacity(0.03))
        .clipShape(.rect(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(.separator, lineWidth: 0.5)
        )
    }

    private func copyToClipboard() {
        #if os(macOS)
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(code, forType: .string)
        #else
        UIPasteboard.general.string = code
        #endif
        copied = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            copied = false
        }
    }
}
