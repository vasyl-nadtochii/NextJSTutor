import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';

function HomePage(props) {
    return <Fragment>
        <Head>
            <title>NEXTJS Meetups</title>
            // here we can add HEAD metadata like title, description...
        </Head>
        <MeetupList meetups = { props.meetups }/>
    </Fragment>
        
}

export async function getStaticProps() {
    // fetch data from an API
    const client = await MongoClient
        .connect('mongodb+srv://vasyanadtochiy146:Sword2233@cluster0.kmdxjlt.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(
                meetup => ({
                    title: meetup.data.title,
                    address: meetup.data.address,
                    image: meetup.data.image,
                    id: meetup._id.toString()
                })
            )
        },
        revalidate: 1
    };
}

// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;

//     // fetch data from an API

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export default HomePage;