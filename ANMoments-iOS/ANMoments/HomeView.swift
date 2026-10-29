import SwiftUI
import PhotosUI
import UIKit

private enum MainTab: String, CaseIterable {
    case moments = "Khoảnh khắc"
    case friends = "Bạn bè"
    case profile = "Cá nhân"

    var symbol: String {
        switch self {
        case .moments: return "house.fill"
        case .friends: return "person.2"
        case .profile: return "person.crop.circle"
        }
    }
}

struct HomeView: View {
    @State private var tab: MainTab = .moments
    @State private var photoItem: PhotosPickerItem?
    @State private var cameraImage: UIImage?
    @State private var composingImage: UIImage?
    @State private var showingCamera = false
    @State private var showingComposer = false

    var body: some View {
        ZStack {
            Palette.background.ignoresSafeArea()

            VStack(spacing: 0) {
                header

                Group {
                    switch tab {
                    case .moments:
                        MomentsScreen(photoItem: $photoItem, onCamera: openCamera)
                    case .friends:
                        FriendsScreen()
                    case .profile:
                        ProfileScreen()
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)

                bottomBar
            }
        }
        .sheet(isPresented: $showingCamera, onDismiss: {
            if let image = cameraImage {
                composingImage = image
                cameraImage = nil
                showingComposer = true
            }
        }) {
            CameraPicker { image in
                cameraImage = image
            }
            .ignoresSafeArea()
        }
        .sheet(isPresented: $showingComposer, onDismiss: {
            composingImage = nil
        }) {
            if let image = composingImage {
                ComposerView(image: image)
            }
        }
        .onChange(of: photoItem) { _, newValue in
            guard let newValue else { return }
            Task {
                let data = try? await newValue.loadTransferable(type: Data.self)
                await MainActor.run {
                    if let data, let image = UIImage(data: data) {
                        composingImage = image
                        showingComposer = true
                    }
                    photoItem = nil
                }
            }
        }
    }

    private func openCamera() {
        showingCamera = true
    }

    private var header: some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 13, style: .continuous)
                    .fill(Palette.violet)
                    .frame(width: 42, height: 42)
                Image(systemName: "sparkle")
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundStyle(.white)
            }

            VStack(alignment: .leading, spacing: 2) {
                Text("AN MOMENTS")
                    .font(.system(size: 18, weight: .heavy, design: .rounded))
                    .tracking(1.8)
                    .foregroundStyle(.white)
                Text("PRIVATE PHOTO JOURNAL")
                    .font(.system(size: 9, weight: .semibold))
                    .tracking(1.4)
                    .foregroundStyle(Palette.muted)
            }

            Spacer()

            Text("BETA 1")
                .font(.system(size: 10, weight: .bold))
                .tracking(0.7)
                .foregroundStyle(Palette.teal)
                .padding(.horizontal, 10)
                .padding(.vertical, 7)
                .background(Palette.teal.opacity(0.10), in: Capsule())
        }
        .padding(.horizontal, 22)
        .padding(.vertical, 12)
    }

    private var bottomBar: some View {
        HStack(spacing: 0) {
            ForEach(MainTab.allCases, id: \.self) { item in
                Button {
                    withAnimation(.easeInOut(duration: 0.18)) { tab = item }
                } label: {
                    VStack(spacing: 5) {
                        Image(systemName: item.symbol)
                            .font(.system(size: 19, weight: .semibold))
                        Text(item.rawValue)
                            .font(.system(size: 10, weight: .medium))
                    }
                    .foregroundStyle(tab == item ? Palette.teal : Palette.muted)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 18)
        .background(Palette.surface)
    }
}

private struct MomentsScreen: View {
    @EnvironmentObject private var store: MomentStore
    @AppStorage("anmoments.profile.name") private var displayName = "An"
    @Binding var photoItem: PhotosPickerItem?
    let onCamera: () -> Void

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 22) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Xin chào, \(displayName) 👋")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                    Text("Giữ lại những khoảnh khắc mà bạn yêu thích.")
                        .font(.system(size: 14))
                        .foregroundStyle(Palette.muted)
                }

                HStack(alignment: .center, spacing: 18) {
                    VStack(alignment: .leading, spacing: 9) {
                        Text("MỘT NGÀY, MỘT KHOẢNH KHẮC")
                            .font(.system(size: 10, weight: .bold))
                            .tracking(1.1)
                            .foregroundStyle(Palette.teal)
                        Text("Lưu lại điều đẹp nhất hôm nay.")
                            .font(.system(size: 22, weight: .bold, design: .rounded))
                            .fixedSize(horizontal: false, vertical: true)
                    }

                    Spacer(minLength: 6)

                    Image(systemName: "camera.macro")
                        .font(.system(size: 55, weight: .ultraLight))
                        .foregroundStyle(Palette.violet)
                }
                .padding(22)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Palette.surface, in: RoundedRectangle(cornerRadius: 24))

                HStack(spacing: 12) {
                    Button(action: onCamera) {
                        Label("Chụp ảnh", systemImage: "camera.fill")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(PrimaryButtonStyle())

                    PhotosPicker(selection: $photoItem, matching: .images) {
                        Label("Chọn từ máy", systemImage: "photo.on.rectangle")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(SecondaryButtonStyle())
                }

                HStack {
                    Text("KHOẢNH KHẮC ĐÃ LƯU")
                        .font(.system(size: 11, weight: .bold))
                        .tracking(1.4)
                        .foregroundStyle(Palette.muted)
                    Spacer()
                    Text("\(store.moments.count)")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundStyle(Palette.teal)
                }

                if store.moments.isEmpty {
                    VStack(spacing: 15) {
                        Image(systemName: "photo.stack")
                            .font(.system(size: 48, weight: .ultraLight))
                            .foregroundStyle(Palette.violet)
                        Text("Chưa có khoảnh khắc nào")
                            .font(.system(size: 19, weight: .bold, design: .rounded))
                        Text("Chụp hoặc chọn ảnh để tạo khoảnh khắc đầu tiên. Tất cả được lưu trên iPhone của bạn.")
                            .font(.system(size: 13))
                            .foregroundStyle(Palette.muted)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal, 25)
                    .padding(.vertical, 55)
                    .background(Palette.surface, in: RoundedRectangle(cornerRadius: 24))
                } else {
                    LazyVStack(spacing: 18) {
                        ForEach(store.moments) { moment in
                            MomentCard(moment: moment)
                        }
                    }
                }

                Text("Bản thử nghiệm lưu dữ liệu cục bộ và không kết nối máy chủ Locket.")
                    .font(.system(size: 11))
                    .foregroundStyle(Palette.muted)
                    .padding(.top, 6)
                    .padding(.bottom, 18)
            }
            .padding(.horizontal, 20)
            .padding(.top, 20)
        }
    }
}

private struct MomentCard: View {
    @EnvironmentObject private var store: MomentStore
    let moment: Moment

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 10) {
                Image(systemName: "sparkle")
                    .font(.system(size: 18))
                    .foregroundStyle(Palette.teal)
                    .frame(width: 32, height: 32)
                    .background(Palette.raised, in: Circle())

                VStack(alignment: .leading, spacing: 3) {
                    Text("Khoảnh khắc của bạn")
                        .font(.system(size: 13, weight: .semibold))
                    Text(moment.createdAt.formatted(date: .abbreviated, time: .shortened))
                        .font(.system(size: 11))
                        .foregroundStyle(Palette.muted)
                }

                Spacer()

                Menu {
                    ShareLink(item: store.imageURL(for: moment)) {
                        Label("Chia sẻ ảnh", systemImage: "square.and.arrow.up")
                    }
                    Button(role: .destructive) {
                        store.remove(moment)
                    } label: {
                        Label("Xóa khoảnh khắc", systemImage: "trash")
                    }
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 20))
                        .foregroundStyle(Palette.muted)
                        .frame(width: 36, height: 36)
                }
            }

            if let image = store.image(for: moment) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
                    .frame(maxWidth: .infinity)
                    .frame(height: 310)
                    .clipped()
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                    .accessibilityLabel("Ảnh khoảnh khắc")
            } else {
                RoundedRectangle(cornerRadius: 18)
                    .fill(Palette.raised)
                    .frame(height: 180)
                    .overlay {
                        Label("Không tìm thấy ảnh", systemImage: "photo.badge.exclamationmark")
                            .foregroundStyle(Palette.muted)
                    }
            }

            if !moment.caption.isEmpty {
                Text(moment.caption)
                    .font(.system(size: 14))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }

            ShareLink(item: store.imageURL(for: moment)) {
                Label("Chia sẻ", systemImage: "square.and.arrow.up")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Palette.teal)
            }
        }
        .padding(15)
        .background(Palette.surface, in: RoundedRectangle(cornerRadius: 22))
    }
}

private struct FriendsScreen: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Image(systemName: "person.2.crop.square.stack")
                    .font(.system(size: 54, weight: .ultraLight))
                    .foregroundStyle(Palette.teal)
                Text("Bạn bè")
                    .font(.system(size: 29, weight: .bold, design: .rounded))
                Text("Bản thử nghiệm này chưa có tài khoản và máy chủ. Vì vậy, gửi ảnh trực tiếp tới bạn bè và widget nhận ảnh chưa được kích hoạt.")
                    .font(.system(size: 14))
                    .foregroundStyle(Palette.muted)
                    .multilineTextAlignment(.center)
                Text("Bạn vẫn có thể lưu ảnh và dùng nút Chia sẻ để gửi qua tính năng có sẵn trên iOS.")
                    .font(.system(size: 13))
                    .foregroundStyle(Palette.teal)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding(28)
            .background(Palette.surface, in: RoundedRectangle(cornerRadius: 25))
            .padding(.horizontal, 20)
            .padding(.top, 46)
        }
    }
}

private struct ProfileScreen: View {
    @AppStorage("anmoments.profile.name") private var displayName = "An"
    @EnvironmentObject private var store: MomentStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                HStack(spacing: 14) {
                    Image(systemName: "person.crop.circle.fill")
                        .font(.system(size: 56))
                        .foregroundStyle(Palette.violet)
                    VStack(alignment: .leading, spacing: 5) {
                        Text("Hồ sơ của bạn")
                            .font(.system(size: 23, weight: .bold, design: .rounded))
                        Text("Không cần Telegram hoặc tài khoản ngoài")
                            .font(.system(size: 12))
                            .foregroundStyle(Palette.muted)
                    }
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text("TÊN HIỂN THỊ")
                        .font(.system(size: 11, weight: .bold))
                        .tracking(1.3)
                        .foregroundStyle(Palette.muted)
                    TextField("Tên của bạn", text: $displayName)
                        .textInputAutocapitalization(.words)
                        .padding(14)
                        .background(Palette.raised, in: RoundedRectangle(cornerRadius: 14))
                }

                HStack {
                    Label("Khoảnh khắc đã lưu", systemImage: "photo.stack")
                    Spacer()
                    Text("\(store.moments.count)")
                        .foregroundStyle(Palette.teal)
                }
                .font(.system(size: 14, weight: .semibold))

                VStack(alignment: .leading, spacing: 8) {
                    Text("Quyền riêng tư")
                        .font(.system(size: 17, weight: .bold))
                    Text("Ảnh nằm trong thư mục Documents của ứng dụng trên iPhone. Không có API bên ngoài, tài khoản Telegram, hoặc SDK quảng cáo.")
                        .font(.system(size: 13))
                        .foregroundStyle(Palette.muted)
                    Text("Khi gỡ ứng dụng, dữ liệu cục bộ có thể bị xóa. Hãy chia sẻ hoặc sao lưu ảnh quan trọng trước khi gỡ.")
                        .font(.system(size: 13))
                        .foregroundStyle(Palette.muted)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(18)
                .background(Palette.raised, in: RoundedRectangle(cornerRadius: 19))

                Text("AN Moments • Prototype 1.0")
                    .font(.system(size: 11))
                    .foregroundStyle(Palette.muted)
            }
            .padding(22)
        }
    }
}

private struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .semibold))
            .padding(.vertical, 15)
            .foregroundStyle(.white)
            .background(Palette.violet, in: RoundedRectangle(cornerRadius: 15))
            .opacity(configuration.isPressed ? 0.75 : 1)
    }
}

private struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .semibold))
            .padding(.vertical, 15)
            .foregroundStyle(.white)
            .background(Palette.raised, in: RoundedRectangle(cornerRadius: 15))
            .opacity(configuration.isPressed ? 0.75 : 1)
    }
}
