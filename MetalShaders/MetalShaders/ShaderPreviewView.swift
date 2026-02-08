import SwiftUI
import MetalKit

struct ShaderPreviewView {
    let metalSource: String
    let fragmentFunctionName: String
    var preferredFPS: Int = 60

    @State private var renderer: ShaderRenderer?
}

#if os(macOS)
extension ShaderPreviewView: NSViewRepresentable {
    func makeNSView(context: Context) -> MTKView {
        makeMetalView()
    }

    func updateNSView(_ nsView: MTKView, context: Context) {}
}
#else
extension ShaderPreviewView: UIViewRepresentable {
    func makeUIView(context: Context) -> MTKView {
        makeMetalView()
    }

    func updateUIView(_ uiView: MTKView, context: Context) {}
}
#endif

extension ShaderPreviewView {
    private func makeMetalView() -> MTKView {
        let view = MTKView()
        guard let device = MTLCreateSystemDefaultDevice() else { return view }

        view.device = device
        view.colorPixelFormat = .bgra8Unorm
        view.preferredFramesPerSecond = preferredFPS
        view.enableSetNeedsDisplay = false
        view.isPaused = false

        if let renderer = ShaderRenderer(
            device: device,
            metalSource: metalSource,
            fragmentFunctionName: fragmentFunctionName
        ) {
            view.delegate = renderer
            DispatchQueue.main.async {
                self.renderer = renderer
            }
        }

        return view
    }
}
