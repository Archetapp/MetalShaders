import MetalKit

final class ShaderRenderer: NSObject, MTKViewDelegate {
    private let device: MTLDevice
    private let commandQueue: MTLCommandQueue
    private var pipelineState: MTLRenderPipelineState?
    private var startTime: CFAbsoluteTime

    init?(device: MTLDevice, metalSource: String, fragmentFunctionName: String) {
        guard let commandQueue = device.makeCommandQueue() else { return nil }
        self.device = device
        self.commandQueue = commandQueue
        self.startTime = CFAbsoluteTimeGetCurrent()
        super.init()

        guard let pipeline = buildPipeline(
            metalSource: metalSource,
            fragmentFunctionName: fragmentFunctionName
        ) else {
            return nil
        }
        self.pipelineState = pipeline
    }

    private func buildPipeline(
        metalSource: String,
        fragmentFunctionName: String
    ) -> MTLRenderPipelineState? {
        guard let defaultLibrary = device.makeDefaultLibrary(),
              let vertexFunction = defaultLibrary.makeFunction(name: "fullscreenVertex")
        else {
            return nil
        }

        guard let fragmentLibrary = try? device.makeLibrary(source: metalSource, options: nil),
              let fragmentFunction = fragmentLibrary.makeFunction(name: fragmentFunctionName)
        else {
            return nil
        }

        let descriptor = MTLRenderPipelineDescriptor()
        descriptor.vertexFunction = vertexFunction
        descriptor.fragmentFunction = fragmentFunction
        descriptor.colorAttachments[0].pixelFormat = .bgra8Unorm

        return try? device.makeRenderPipelineState(descriptor: descriptor)
    }

    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {}

    func draw(in view: MTKView) {
        guard let pipelineState,
              let drawable = view.currentDrawable,
              let descriptor = view.currentRenderPassDescriptor,
              let commandBuffer = commandQueue.makeCommandBuffer(),
              let encoder = commandBuffer.makeRenderCommandEncoder(descriptor: descriptor)
        else {
            return
        }

        var iTime = Float(CFAbsoluteTimeGetCurrent() - startTime)
        var iResolution = SIMD2<Float>(
            Float(view.drawableSize.width),
            Float(view.drawableSize.height)
        )

        encoder.setRenderPipelineState(pipelineState)
        encoder.setFragmentBytes(&iTime, length: MemoryLayout<Float>.size, index: 0)
        encoder.setFragmentBytes(&iResolution, length: MemoryLayout<SIMD2<Float>>.size, index: 1)
        encoder.drawPrimitives(type: .triangleStrip, vertexStart: 0, vertexCount: 4)
        encoder.endEncoding()

        commandBuffer.present(drawable)
        commandBuffer.commit()
    }
}
