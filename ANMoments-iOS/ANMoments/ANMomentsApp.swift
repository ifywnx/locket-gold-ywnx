import SwiftUI

@main
struct ANMomentsApp: App {
    @StateObject private var store = MomentStore()

    var body: some Scene {
        WindowGroup {
            HomeView()
                .environmentObject(store)
                .preferredColorScheme(.dark)
        }
    }
}

enum Palette {
    static let background = Color(red: 0.055, green: 0.067, blue: 0.100)
    static let surface = Color(red: 0.103, green: 0.116, blue: 0.157)
    static let raised = Color(red: 0.143, green: 0.159, blue: 0.207)
    static let violet = Color(red: 0.46, green: 0.43, blue: 0.95)
    static let teal = Color(red: 0.35, green: 0.84, blue: 0.75)
    static let muted = Color(red: 0.66, green: 0.69, blue: 0.76)
}
