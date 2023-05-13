import MetupDetail from '../../components/meetups/MeetupDetail'
import { MongoClient, ObjectId } from 'mongodb';

function MetupDetails(props) {
    return (
        <MetupDetail
            image = { props.meetupData.image }
            title = { props.meetupData.title }
            address = { props.meetupData.address }
            description = { props.meetupData.description }   
        />
    );
}

export async function getStaticPaths() {

    const client = await MongoClient
        .connect('mongodb+srv://vasyanadtochiy146:Sword2233@cluster0.kmdxjlt.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map(
            meetup => ({
                params: { meetupID: meetup._id.toString() }
            })
        )
    }
}

export async function getStaticProps(context) {
    // fetch data for single meetup

    const meetupID = context.params.meetupID;
    const client = await MongoClient
        .connect('mongodb+srv://vasyanadtochiy146:Sword2233@cluster0.kmdxjlt.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({
        _id: new ObjectId(meetupID) 
    });

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.data.title,
                address: selectedMeetup.data.address,
                image: selectedMeetup.data.image,
                description: selectedMeetup.data.description
            }
        },
        revalidate: 10
    };
}

export default MetupDetails;