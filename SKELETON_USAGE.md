# Skeleton Loading Components

## Usage

Import skeleton components in any page:

```jsx
import { SkeletonLine, SkeletonCard, SkeletonList, SkeletonGrid } from '../components/Skeleton';
```

## Examples

### Journal History Page
```jsx
const [loading, setLoading] = useState(true);

if (loading) {
  return (
    <div style={{ padding: '20px' }}>
      <SkeletonList count={5} />
    </div>
  );
}
```

### Chatbot Page
```jsx
if (loading) {
  return (
    <div style={{ padding: '20px' }}>
      <SkeletonCard />
    </div>
  );
}
```

### Tracker Page
```jsx
if (loading) {
  return (
    <div style={{ padding: '20px' }}>
      <SkeletonGrid count={4} />
    </div>
  );
}
```

### Custom Skeleton
```jsx
<SkeletonLine width="80%" height="24px" style={{ marginBottom: '16px' }} />
<SkeletonLine width="60%" height="16px" />
```

## Components

- **SkeletonLine**: Single animated line
- **SkeletonCard**: Card with multiple lines
- **SkeletonList**: List of items with avatars
- **SkeletonGrid**: Grid of cards

## Navbar Improvements

✅ Reduced from 10 buttons to 5 main + More dropdown
✅ Added icons to buttons (🏠 💬 📝 📊 👨‍⚕️)
✅ Cleaner, less overwhelming layout
✅ Subscription badge moved to top-right
✅ Dropdown menu for secondary features
