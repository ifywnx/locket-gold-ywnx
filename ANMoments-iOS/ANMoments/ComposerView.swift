import SwiftUI
import UIKit

struct ComposerView: View {
    @EnvironmentObject private var store: MomentStore
    @Environment(\.dismiss) private var dismiss
    @State private var caption = ""
    @State private var errorMessage: String?
    let image: UIImage

    var body: some View {
        NavigationStack {
            ZStack {
                Palette.background.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 18) {
                        Text("Xem trước")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(Palette.muted)

                        Image(uiImage: image)
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: .infinity)
                            .frame(maxHeight: 440)
                            .background(Palette.surface, in: RoundedRectangle(cornerRadius: 19))
                            .clipShape(RoundedRectangle(cornerRadius: 19))

                        Text("LỜI NHẮN")
                            .font(.system(size: 11, weight: .bold))
                            .tracking(1.2)
                            .foregroundStyle(Palette.muted)

                        TextField("Bạn đang nghĩ gì?", text: $caption, axis: .vertical)
                            .lineLimit(2...5)
                            .font(.system(size: 15))
                            .padding(16)
                            .background(Palette.surface, in: RoundedRectangle(cornerRadius: 15))

                        Label("Ảnh và lời nhắn chỉ lưu trên iPhone của bạn.", systemImage: "lock.shield")
                            .font(.system(size: 12))
                            .foregroundStyle(Palette.teal)
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Khoảnh khắc mới")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Hủy") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Lưu") {
                        do {
                            try store.add(image: image, caption: caption)
                            dismiss()
                        } catch {
                            errorMessage = error.localizedDescription
                        }
                    }
                    .fontWeight(.bold)
                }
            }
            .alert("Không thể lưu khoảnh khắc", isPresented: Binding(
                get: { errorMessage != nil },
                set: { if !$0 { errorMessage = nil } }
            )) {
                Button("OK", role: .cancel) { errorMessage = nil }
            } message: {
                Text(errorMessage ?? "Có lỗi khi lưu ảnh.")
            }
        }
    }
}
