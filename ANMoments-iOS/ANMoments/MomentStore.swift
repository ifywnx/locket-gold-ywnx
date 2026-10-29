import Foundation
import SwiftUI

struct Moment: Identifiable, Codable, Equatable {
    let id: UUID
    let filename: String
    let caption: String
    let createdAt: Date
}

enum MomentStoreError: LocalizedError {
    case imageEncodingFailed

    var errorDescription: String? {
        switch self {
        case .imageEncodingFailed:
            return "Không thể chuyển ảnh sang JPEG để lưu."
        }
    }
}

@MainActor
final class MomentStore: ObservableObject {
    @Published private(set) var moments: [Moment] = []

    private var directory: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("ANMoments", isDirectory: true)
    }

    private var indexURL: URL {
        directory.appendingPathComponent("moments.json")
    }

    init() {
        do {
            try FileManager.default.createDirectory(
                at: directory,
                withIntermediateDirectories: true
            )
            if FileManager.default.fileExists(atPath: indexURL.path) {
                let data = try Data(contentsOf: indexURL)
                moments = try JSONDecoder().decode([Moment].self, from: data)
            }
        } catch {
            // An unreadable local index must not crash the application.
            moments = []
            NSLog("ANMoments: Cannot load local moments: %@", error.localizedDescription)
        }
    }

    func add(image: UIImage, caption: String) throws {
        guard let data = image.jpegData(compressionQuality: 0.86) else {
            throw MomentStoreError.imageEncodingFailed
        }

        try FileManager.default.createDirectory(
            at: directory,
            withIntermediateDirectories: true
        )

        let id = UUID()
        let filename = id.uuidString + ".jpg"
        let file = directory.appendingPathComponent(filename)
        try data.write(to: file, options: .atomic)

        let moment = Moment(
            id: id,
            filename: filename,
            caption: caption.trimmingCharacters(in: .whitespacesAndNewlines),
            createdAt: Date()
        )
        moments.insert(moment, at: 0)

        do {
            try saveIndex()
        } catch {
            moments.removeAll { $0.id == id }
            try? FileManager.default.removeItem(at: file)
            throw error
        }
    }

    func image(for moment: Moment) -> UIImage? {
        UIImage(contentsOfFile: imageURL(for: moment).path)
    }

    func imageURL(for moment: Moment) -> URL {
        directory.appendingPathComponent(moment.filename)
    }

    func remove(_ moment: Moment) {
        let previous = moments
        moments.removeAll { $0.id == moment.id }
        do {
            try saveIndex()
            try? FileManager.default.removeItem(at: imageURL(for: moment))
        } catch {
            moments = previous
            NSLog("ANMoments: Cannot remove moment: %@", error.localizedDescription)
        }
    }

    private func saveIndex() throws {
        let data = try JSONEncoder().encode(moments)
        try data.write(to: indexURL, options: .atomic)
    }
}
