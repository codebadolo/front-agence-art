// TalentStepReview.jsx

export default function TalentStepReview({ data }) {
  return (
    <div style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 12, borderRadius: 4, maxHeight: 400, overflowY: "auto" }}>
      {JSON.stringify(data, null, 2)}
    </div>
  );
}
